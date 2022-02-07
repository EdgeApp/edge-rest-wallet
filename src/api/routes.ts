import {
  EdgeAccount,
  EdgeContext,
  EdgeCurrencyWallet,
  EdgeSpendInfo,
  EdgeTransaction
} from 'edge-core-js'
import { Request, Response } from 'express'
import { Express } from 'express-serve-static-core'

import CONFIG from '../../config.json'
import {
  AddTokensRequest,
  CreateAccountRequest,
  CreateWalletsRequest
} from '../types/api'
import {
  addTokens,
  createWallets,
  CurrencyTokenList,
  getCurrencyTokenList
} from '../util/app'
import { checkCreateUser } from '../util/validations'

export const routes = (
  app: Express,
  context: EdgeContext,
  account: EdgeAccount
): void => {
  // Create Account
  app.post(
    `/${CONFIG.httpCollection.accounts}/`,
    async (
      req: Request<{}, {}, CreateAccountRequest>,
      res: Response<EdgeAccount | string>
    ) => {
      const { username, pin, password } = req.body
      try {
        checkCreateUser(username, password, pin)
        const newAccount = await context.createAccount(username, password, pin)
        res.send(newAccount.id)
        return
      } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
      }
    }
  )

  // Create Wallets
  app.post(
    `/${CONFIG.httpCollection.wallets}/`,
    async (
      req: Request<{}, {}, CreateWalletsRequest>,
      res: Response<EdgeCurrencyWallet[] | string>
    ) => {
      try {
        const { username, password, currencies } = req.body
        const userAccount = await context.loginWithPassword(username, password)
        res.json(await createWallets(userAccount, currencies))
        return
      } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
      }
    }
  )

  // Add Tokens
  app.put(
    `/${CONFIG.httpCollection.walletsTokens}/`,
    async (
      req: Request<{}, {}, AddTokensRequest, { walletId: string }>,
      res: Response<string>
    ) => {
      try {
        const { username, password, tokens, walletId } = req.body
        const userAccount = await context.loginWithPassword(username, password)
        const wallet = await addTokens(userAccount, walletId, tokens)
        return res.json(`Succesfully updated ${wallet.name ?? ''} tokens`)
      } catch (error) {
        return res.status(400).send(error.message)
      }
    }
  )

  // Get Currency and Token List
  app.get(
    `/${CONFIG.httpCollection.currencyTokenList}/`,
    (_, res: Response<CurrencyTokenList>) => {
      try {
        return res.json(getCurrencyTokenList(account))
      } catch (error) {
        return res.status(400).send(error.message)
      }
    }
  )

  // Getting wallet balances based on type of wallet
  app.get('/balances/', async (req, res, next) => {
    const type: string = req.query.type
    const walletInfo = account.getFirstWalletInfo(`wallet:${type}`)
    if (walletInfo == null) {
      res.status(404).send(`${type} is invalid`)
      return
    }
    try {
      const wallet: EdgeCurrencyWallet = await account.waitForCurrencyWallet(
        walletInfo.id
      )
      res.json(wallet.balances)
    } catch (e) {
      res.status(500).send('Server error in waitForCurrencyWallet')
    }
  })

  // Get wallet transactions based on type of wallet
  app.get('/transactions/', async (req, res, next) => {
    const type: string = req.query.type
    const walletInfo = account.getFirstWalletInfo(`wallet:${type}`)
    if (walletInfo == null) {
      res.status(404).send(`${type} is invalid`)
      return
    }
    try {
      const wallet: EdgeCurrencyWallet = await account.waitForCurrencyWallet(
        walletInfo.id
      )
      const transactions: EdgeTransaction[] = await wallet.getTransactions()
      const cleanTransactions = transactions.filter(value => {
        delete value.wallet
        // @ts-expect-error
        delete value.amountSatoshi
        if (value.otherParams != null) delete value.otherParams.debugInfo
        return value
      })
      res.send(cleanTransactions)
    } catch (e) {
      res.status(500).send('Server error in waitForCurrencyWallet')
    }
  })

  app.post('/spend/', async (req, res, next) => {
    const type: string = req.query.type
    const spendInfo: EdgeSpendInfo = req.body
    const walletInfo = account.getFirstWalletInfo(`wallet:${type}`)
    if (walletInfo == null) {
      res.status(404).send(`${type} is invalid`)
      return
    }
    const wallet: EdgeCurrencyWallet = await account.waitForCurrencyWallet(
      walletInfo.id
    )
    let edgeTransaction: EdgeTransaction
    try {
      edgeTransaction = await wallet.makeSpend(spendInfo)
    } catch (e) {
      res.status(400).send('Body does not match EdgeSpendInfo specification')
      return
    }
    try {
      const signedTx = await wallet.signTx(edgeTransaction)
      await wallet.broadcastTx(signedTx)
      await wallet.saveTx(signedTx)
      res.send(signedTx)
    } catch (e) {
      res.status(500).send('Internal server error')
    }
  })
}

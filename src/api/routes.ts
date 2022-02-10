import {
  EdgeAccount,
  EdgeContext,
  EdgeCurrencyWallet,
  EdgeSpendInfo,
  EdgeTransaction
} from 'edge-core-js'
import { Express } from 'express-serve-static-core'

export const routes = (
  app: Express,
  context: EdgeContext,
  account: EdgeAccount
): void => {
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

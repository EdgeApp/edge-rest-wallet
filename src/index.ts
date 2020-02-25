import bodyParser from 'body-parser'
import {
  addEdgeCorePlugins,
  EdgeAccount,
  EdgeContext,
  EdgeCurrencyWallet,
  lockEdgeCorePlugins,
  makeEdgeContext
} from 'edge-core-js'
import bitcoinPlugins from 'edge-currency-bitcoin'
import express from 'express'

import CONFIG from '../config.json'
addEdgeCorePlugins(bitcoinPlugins)
lockEdgeCorePlugins()

async function main(): Promise<void> {
  const app = express()

  // Start the core, with Bitcoin enabled:
  const context: EdgeContext = await makeEdgeContext({
    apiKey: CONFIG.apiKey,
    appId: CONFIG.appId,
    plugins: CONFIG.plugins
  })

  // Log in to some user:
  const account: EdgeAccount = await context.loginWithPassword(
    CONFIG.username,
    CONFIG.password
  )

  app.use(bodyParser.json({ limit: '1mb' }))

  // Getting wallet balances based on type of wallet
  app.get('/balances/', async (req, res, next) => {
    const type = req.query.type
    const walletInfo = account.getFirstWalletInfo(`wallet:${type}`)
    if (walletInfo == null) {
      res.status(404).send(`${type} is invalid`)
      return
    }
    try {
      const wallet: EdgeCurrencyWallet = await account.waitForCurrencyWallet(
        walletInfo.id
      )
      res.send(wallet.balances)
    } catch (e) {
      res.status(500).send('Server error in waitForCurrencyWallet')
    }
  })

  app.listen(CONFIG.httpPort, () => {
    console.log('Server is listening on:', CONFIG.httpPort)
  })
}
main().catch(e => {
  console.error(e)
  process.exit(1)
})

import {
  addEdgeCorePlugins,
  EdgeAccount,
  EdgeContext,
  lockEdgeCorePlugins,
  makeEdgeContext
} from 'edge-core-js'
import currencyPlugins from 'edge-currency-accountbased'
import bitcoinPlugins from 'edge-currency-bitcoin'
import moneroPlugins from 'edge-currency-monero'

import CONFIG from '../../config.json'

addEdgeCorePlugins(bitcoinPlugins)
addEdgeCorePlugins(currencyPlugins)
addEdgeCorePlugins(moneroPlugins)
lockEdgeCorePlugins()

export const initializeEdgeContextAndUser = async (): Promise<{
  context: EdgeContext
  account: EdgeAccount
}> => {
  const context: EdgeContext = await makeEdgeContext({
    apiKey: CONFIG.apiKey,
    appId: CONFIG.appId,
    plugins: CONFIG.plugins,
    logSettings: {
      defaultLogLevel: 'silent'
    }
  })

  const account: EdgeAccount = await context.loginWithPassword(
    CONFIG.username,
    CONFIG.password,
    { otpKey: CONFIG.otpKey ?? undefined }
  )

  return { context, account }
}

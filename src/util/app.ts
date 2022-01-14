import type {
  EdgeAccount,
  EdgeCurrencyConfig,
  EdgeCurrencyWallet,
  EdgePluginMap
} from 'edge-core-js'

interface CurrencyDetails {
  pluginId: string
  displayName: string
}

export interface CurrencyTokenList {
  currencies: CurrencyDetails[]
  tokens: {}
}

const DEFAULT_ISO_FIAT = 'iso:USD'

export const createWallets = async (
  account: EdgeAccount,
  currencies: string[]
): Promise<EdgeCurrencyWallet[]> => {
  const out: EdgeCurrencyWallet[] = []

  for await (const currency of currencies) {
    const { currencyInfo } = account.currencyConfig[currency]
    const { walletType, displayName } = currencyInfo
    const [type, format] = walletType.split('-')
    const opts = {
      name: `My ${displayName}`,
      fiatCurrencyCode: DEFAULT_ISO_FIAT,
      keyOptions: format != null ? { format } : {}
    }

    out.push(await account.createCurrencyWallet(type, opts))
  }

  return out
}

export const addTokens = async (
  account: EdgeAccount,
  walletId: string,
  currencyCodes: string[]
): Promise<EdgeCurrencyWallet> => {
  const wallet: EdgeCurrencyWallet = account.currencyWallets[walletId]
  await wallet.changeEnabledTokens(currencyCodes)
  return wallet
}

const getCurrencyList = (
  currencyConfig: EdgePluginMap<EdgeCurrencyConfig>
): CurrencyDetails[] => {
  const currencies = Object.keys(currencyConfig)
  return currencies.map(currency => ({
    pluginId: currencyConfig[currency].currencyInfo.pluginId,
    displayName: currencyConfig[currency].currencyInfo.displayName
  }))
}

const getTokenList = (
  currencyConfig: EdgePluginMap<EdgeCurrencyConfig>
): {} => {
  const tokens = {}
  const currencies = Object.keys(currencyConfig)
  currencies.forEach((currency: string) => {
    const { currencyInfo } = currencyConfig[currency]
    if (currencyInfo.metaTokens.length > 0) {
      tokens[currencyInfo.pluginId] = currencyInfo.metaTokens
    }
  })

  return tokens
}

export const getCurrencyTokenList = (
  account: EdgeAccount
): CurrencyTokenList => ({
  currencies: getCurrencyList(account.currencyConfig),
  tokens: getTokenList(account.currencyConfig)
})

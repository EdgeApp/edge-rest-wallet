import type { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js'

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

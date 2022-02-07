import { EdgeCurrencyWallet } from 'edge-core-js'

import {
  CreateUserAccountData,
  CreateUserWalletIdAndTokens
} from '../../types/html'
import { Token } from '../components/CreateAccountAddTokens'
import { addAccount, addTokens, addWallets } from './api'

const findWalletFromTokensToBeAdded = (
  wallets: EdgeCurrencyWallet[],
  currency: string,
  usedWalletIds: string[]
): EdgeCurrencyWallet | undefined => {
  return wallets.find(wallet => {
    const { pluginId } = wallet.currencyInfo
    return (
      pluginId === currency &&
      usedWalletIds.find(walletId => walletId === wallet.id) == null
    )
  })
}

const getWalletIdAndTokens = (
  tokens: Token[],
  wallets: EdgeCurrencyWallet[]
): CreateUserWalletIdAndTokens[] => {
  const tokenKeys = Object.keys(tokens)
  const usedWalletIds: string[] = []
  const wallletIdAndTokens: CreateUserWalletIdAndTokens[] = []

  tokenKeys.forEach(tokenKey => {
    const tokenKeyStrings = tokenKey.split('-')
    const wallet = findWalletFromTokensToBeAdded(
      wallets,
      tokenKeyStrings[1],
      usedWalletIds
    )
    if (wallet != null) {
      usedWalletIds.push(wallet.id)
      wallletIdAndTokens.push({ walletId: wallet.id, tokens: tokens[tokenKey] })
    }
  })

  return wallletIdAndTokens
}

export const createAccount = async (
  user: CreateUserAccountData,
  currencies: string[],
  tokens: Token[]
): Promise<string> => {
  await addAccount(user)
  const wallets = await addWallets(user, currencies)
  const walletIdAndTokens = getWalletIdAndTokens(tokens, wallets)

  walletIdAndTokens.forEach(
    async ({ walletId, tokens }) => await addTokens(user, walletId, tokens)
  )
  return 'Successfully created account'
}

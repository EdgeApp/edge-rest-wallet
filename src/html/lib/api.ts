import { EdgeCurrencyWallet } from 'edge-core-js'

import CONFIG from '../../../config.json'
import { CurrencyTokenList } from '../../util/app'
import { Token } from '../components/CreateAccountAddTokens'

interface CreateUserData {
  username: string
  password: string
  pin: string
}

interface CreateUserWalletIdAndTokens {
  walletId: string
  tokens: string[]
}

const apiURL = `${CONFIG.httpProtocol}://${CONFIG.httpApiDev}:${CONFIG.httpPort}`

const processResponse = async (response: Response): Promise<any> => {
  if (/^[4-5][0-9][0-9]$/.test(`${response.status}`)) {
    const json = await response.json()
    throw new Error(json.message)
  }

  const json = response.json()
  return await json
}

export const addAccount = async (data: CreateUserData): Promise<string> => {
  const response = await fetch(`${apiURL}/${CONFIG.httpCollection.accounts}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  await processResponse(response)
  return 'Account Created Successfully'
}

export const getCurrencyTokenList = async (): Promise<CurrencyTokenList> => {
  const response = await fetch(
    `${apiURL}/${CONFIG.httpCollection.currencyTokenList}/`
  )
  return await processResponse(response)
}

export const addWallets = async (
  { username, password }: CreateUserData,
  currencies: string[]
): Promise<EdgeCurrencyWallet[]> => {
  const body = { username, password, currencies }
  const response = await fetch(`${apiURL}/${CONFIG.httpCollection.wallets}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  return await processResponse(response)
}

export const addTokens = async (
  { username, password }: CreateUserData,
  walletId: string,
  tokens: string[]
): Promise<string> => {
  const response = await fetch(
    `${apiURL}/${CONFIG.httpCollection.walletsTokens}/`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, tokens, walletId })
    }
  )

  await processResponse(response)
  return 'Tokens Successfully Created'
}

const findWalletFromTokensToBeAdded = (
  wallets: EdgeCurrencyWallet[],
  currency: string,
  usedWalletIds: string[]
): EdgeCurrencyWallet | void => {
  return wallets.find(wallet => {
    const { pluginId } = wallet.currencyInfo
    return (
      pluginId === currency &&
      usedWalletIds.find(walletId => walletId !== wallet.id) != null
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
    const [_, currency] = tokenKey.split('-')
    const wallet = findWalletFromTokensToBeAdded(
      wallets,
      currency,
      usedWalletIds
    )
    if (wallet != null) {
      usedWalletIds.push(wallet.id)
      wallletIdAndTokens.push({ walletId: wallet.id, tokens: tokens[tokenKey] })
    }
  })

  console.log(wallletIdAndTokens)
  return wallletIdAndTokens
}

export const createAccount = async (
  user: CreateUserData,
  currencies: string[],
  tokens: Token[]
) => {
  const addWalletsResponse = await addWallets(user, currencies)
  // const walletIdAndTokens = getWalletIdAndTokens(tokens, addWalletsResponse, )
  //
  // const addTokenPromises = walletIdAndTokens.map(({ walletId, tokens }) => () => addTokens(user, walletId, tokens))
  // console.log(addTokenPromises)
  // await Promise.all(addTokenPromises)
  return 'yey'
}

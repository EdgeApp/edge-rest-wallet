import { EdgeCurrencyWallet } from 'edge-core-js'

import CONFIG from '../../../config.json'
import { CreateUserAccountData } from '../../types/html'
import { CurrencyTokenList } from '../../util/app'

const apiURL = `${CONFIG.httpProtocol}://${CONFIG.httpApiDev}:${CONFIG.httpPort}`

const processResponse = async (response: Response): Promise<any> => {
  if (/^[4-5][0-9][0-9]$/.test(`${response.status}`)) {
    const json = await response.json()
    throw new Error(json.message)
  }

  const json = response.json()
  return await json
}

export const addAccount = async (
  data: CreateUserAccountData
): Promise<string> => {
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
  { username, password }: CreateUserAccountData,
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
  { username, password }: CreateUserAccountData,
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

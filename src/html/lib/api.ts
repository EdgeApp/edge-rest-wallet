import CONFIG from '../../../config.json'
import { CurrencyTokenList } from '../../util/app'

interface CreateUserData {
  username: string
  password: string
  pin: string
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

export const createAcount = async (data: CreateUserData): Promise<string> => {
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

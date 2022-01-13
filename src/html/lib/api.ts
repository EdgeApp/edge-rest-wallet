import CONFIG from '../../../config.json'

interface CreateUserData {
  username: string
  password: string
  pin: string
}

const apiURL = `${CONFIG.httpProtocol}://${CONFIG.httpApiDev}:${CONFIG.httpPort}`

const processResponse = async (response: Response): Promise<string> => {
  if (/^[4-5][0-9][0-9]$/.test(`${response.status}`)) {
    const json = await response.json()
    throw new Error(json.message)
  }

  return 'Account successfully created'
}

export const createAcount = async (data: CreateUserData): Promise<string> => {
  const response = await fetch(`${apiURL}/${CONFIG.httpCollection.accounts}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return await processResponse(response)
}

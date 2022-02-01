export interface CreateAccountRequest {
  username: string
  password: string
  pin: string
}

export interface CreateWalletsRequest {
  username: string
  password: string
  currencies: string[]
}

export interface AddTokensRequest {
  username: string
  password: string
  tokens: string[]
  walletId: string
}

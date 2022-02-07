export interface CreateUserAccountData {
  username: string
  password: string
  pin: string
}

export interface CreateUserWalletIdAndTokens {
  walletId: string
  tokens: string[]
}

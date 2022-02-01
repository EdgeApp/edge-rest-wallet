import { EdgeCurrencyWallet } from 'edge-core-js'

const ENABLED_TOKENS_FILENAME = 'EnabledTokens.json'

export const setEnabledTokens = (
  wallet: EdgeCurrencyWallet,
  tokens: string[]
): void => {
  wallet.disklet
    .setText(ENABLED_TOKENS_FILENAME, JSON.stringify(tokens))
    .then(async () => await wallet.changeEnabledTokens(tokens))
    .catch(error => console.log(error))
}

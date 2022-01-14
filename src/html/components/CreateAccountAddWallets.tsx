import 'bootstrap/dist/css/bootstrap.min.css'

import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import { CurrencyTokenList } from '../../util/app'
import { getCurrencyTokenList } from '../lib/api'

interface Props {
  currencies: string[]
  tokens: string[]
  setCurrencies: (currencies: string[]) => void
  setTokens: (tokens: string[]) => void
}

type FormEvent = React.ChangeEvent<HTMLSelectElement>

export const CreateAccountAddWallets: React.FC<Props> = (
  props
): React.ReactElement => {
  const { currencies, tokens, setCurrencies, setTokens } = props
  const [currencyTokenList, setCurrencyTokenList] = useState<CurrencyTokenList>(
    { currencies: [], tokens: {} }
  )

  // Just for the typescript unused warning
  console.log(tokens)
  console.log(setTokens)

  useEffect(() => {
    getCurrencyTokenList()
      .then(response => {
        setCurrencyTokenList(response)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const addWallet = (): void =>
    setCurrencies([...currencies, currencyTokenList.currencies[0].pluginId])

  const removeWallet = (): void => {
    currencies.length > 0 &&
      setCurrencies(currencies.slice(0, currencies.length - 1))
  }

  const sumbit = (): void => {
    console.log(currencies)
  }

  const renderCurrencyFormOptions = (): React.ReactNode => {
    return currencyTokenList.currencies.map(currency => (
      <option value={currency.pluginId} key={currency.pluginId}>
        {currency.displayName}
      </option>
    ))
  }

  const renderCurrencyForm = (index: number): React.ReactNode => {
    const handleCurrency = (event: FormEvent): void =>
      setCurrencies(
        Object.assign([], currencies, { [index]: event.target.value })
      )
    return (
      <Form.Select
        aria-label="Select Currency"
        value={currencies[index]}
        onChange={handleCurrency}
        key={index}
      >
        {renderCurrencyFormOptions()}
      </Form.Select>
    )
  }

  return (
    <div>
      {currencyTokenList.currencies.length > 0 ? (
        <Button variant="primary" onClick={addWallet}>
          Add Wallet
        </Button>
      ) : (
        <p>Fetching List</p>
      )}
      {currencies.length > 0 && (
        <Button variant="secondary" onClick={removeWallet}>
          Remove wallet
        </Button>
      )}
      {currencies.map((_, index) => renderCurrencyForm(index))}
      <br />
      <Button variant="primary" onClick={sumbit}>
        Submit
      </Button>
    </div>
  )
}

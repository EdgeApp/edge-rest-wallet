import 'bootstrap/dist/css/bootstrap.min.css'

import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import { CurrencyTokenList } from '../../util/app'
import { getCurrencyTokenList } from '../lib/api'
import { CreateAccountAddTokens, Token } from './CreateAccountAddTokens'

interface Props {
  currencies: string[]
  tokens: Token[]
  setCurrencies: (currencies: string[]) => void
  setTokens: (tokens: Token[]) => void
}

type FormEvent = React.ChangeEvent<HTMLSelectElement>

const getIndexAndCurrency = (index: number, pluginId: string): string =>
  `${index}-${pluginId}`

export const CreateAccountAddWallets: React.FC<Props> = (
  props
): React.ReactElement => {
  const { currencies, tokens, setCurrencies, setTokens } = props
  const [currencyTokenList, setCurrencyTokenList] = useState<CurrencyTokenList>(
    { currencies: [], tokens: {} }
  )

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
    if (currencies.length > 0) {
      const index = currencies.length - 1
      const pluginId = currencies[index]
      const tokenKey = getIndexAndCurrency(index, pluginId)
      const token = tokens[tokenKey]
      if (token != null) {
        const { [tokenKey]: removed, ...rest } = tokens
        setTokens({ ...rest })
      }
      setCurrencies(currencies.slice(0, index))
    }
  }

  const addToken = (
    indexAndCurrency: string,
    tokenList: string[],
    defaultTokenCode: string
  ): void => {
    if (tokenList == null) {
      setTokens({ ...tokens, [indexAndCurrency]: [defaultTokenCode] })
    } else {
      setTokens({
        ...tokens,
        [indexAndCurrency]: [...tokenList, defaultTokenCode]
      })
    }
  }

  const removeToken = (indexAndCurrency: string, tokenList: string[]): void => {
    if (tokenList != null && tokenList.length > 0) {
      setTokens({
        ...tokens,
        [indexAndCurrency]: tokenList.slice(0, tokenList.length - 1)
      })
    }
  }

  const changeToken = (
    indexAndCurrency: string,
    tokenList: string[],
    tokenIndex: number,
    value: string
  ): void => {
    if (tokenList != null && tokenList.length > 0) {
      const newTokenList = Object.assign([], tokenList, { [tokenIndex]: value })
      setTokens({ ...tokens, [indexAndCurrency]: newTokenList })
    }
  }

  const renderTokensForm = (index: number): React.ReactNode => {
    const pluginId = currencies[index]
    const indexAndCurrency = getIndexAndCurrency(index, pluginId)
    const tokenList = tokens[indexAndCurrency]
    const handleAddToken = (): void =>
      addToken(
        indexAndCurrency,
        tokenList,
        currencyTokenList.tokens[pluginId][0].currencyCode
      )
    const handleRemoveToken = (): void =>
      removeToken(indexAndCurrency, tokenList)
    const handleChangeToken = (tokenIndex: number, value: string): void =>
      changeToken(indexAndCurrency, tokenList, tokenIndex, value)

    return (
      <>
        <Button variant="primary" onClick={handleAddToken}>
          +
        </Button>
        {tokenList != null && tokenList.length > 0 && (
          <Button variant="secondary" onClick={handleRemoveToken}>
            -
          </Button>
        )}
        {tokenList != null &&
          tokenList.map((_: string, tokenIndex: number) => (
            <CreateAccountAddTokens
              key={tokenIndex}
              index={tokenIndex}
              value={tokenList[tokenIndex]}
              tokenList={currencyTokenList.tokens[pluginId]}
              handleChangeToken={handleChangeToken}
            />
          ))}
      </>
    )
  }

  const renderCurrencyFormOptions = (): React.ReactNode => {
    return currencyTokenList.currencies.map(currency => (
      <option value={currency.pluginId} key={currency.pluginId}>
        {currency.displayName}
      </option>
    ))
  }

  const renderCurrencyForm = (index: number): React.ReactNode => {
    const handleCurrencyChange = (event: FormEvent): void =>
      setCurrencies(
        Object.assign([], currencies, { [index]: event.target.value })
      )
    return (
      <div>
        <Form.Select
          aria-label="Select Currency"
          value={currencies[index]}
          onChange={handleCurrencyChange}
          key={index}
        >
          {renderCurrencyFormOptions()}
        </Form.Select>
        {currencyTokenList.tokens[currencies[index]] != null &&
          renderTokensForm(index)}
      </div>
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
    </div>
  )
}

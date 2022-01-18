import 'bootstrap/dist/css/bootstrap.min.css'

import { EdgeMetaToken } from 'edge-core-js'
import React from 'react'
import { Form } from 'react-bootstrap'

export interface Token {
  [indexAndCurrency: string]: string[]
}

interface Props {
  index: number
  value: string
  tokenList: EdgeMetaToken[]
  handleChangeToken: (index: number, value: string) => void
}

type FormEvent = React.ChangeEvent<HTMLSelectElement>

export const CreateAccountAddTokens: React.FC<Props> = (
  props
): React.ReactElement => {
  const { index, value, tokenList, handleChangeToken } = props

  const handleChange = (event: FormEvent): void =>
    handleChangeToken(index, event.target.value)

  const renderCurrencyFormOptions = (): React.ReactNode => {
    return tokenList.map(({ currencyName, currencyCode }, index: number) => (
      <option value={currencyCode} key={index}>
        {currencyName}
      </option>
    ))
  }

  return (
    <Form.Select
      aria-label="Select Token"
      value={value}
      onChange={handleChange}
      key={index}
    >
      {renderCurrencyFormOptions()}
    </Form.Select>
  )
}

import * as React from 'react'
import { Button, Form } from 'react-bootstrap'

import { createAccount } from '../lib/api'
import { Token } from './CreateAccountAddTokens'
import { CreateAccountAddWallets } from './CreateAccountAddWallets'
import { CreateAccountDetails } from './CreateAccountDetails'

type SubmitEvent = React.ChangeEvent<HTMLFormElement>

export const CreateAccountScene: React.FC<{}> = (): React.ReactElement => {
  const [username, setUsername] = React.useState<string>('foofoo1085')
  const [password, setPassword] = React.useState<string>('P@ssw0rd12')
  const [pin, setPin] = React.useState<string>('1234')
  const [currencies, setCurrencies] = React.useState<string[]>([])
  const [tokens, setTokens] = React.useState<Token[]>([])
  const [successMessage, setSuccessMessage] = React.useState<string>('')
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const submit = (event: SubmitEvent): void => {
    event.preventDefault()
    createAccount({ username, password, pin }, currencies, tokens)
      .then((message: string) => {
        setSuccessMessage(message)
        console.log(successMessage)
      })
      .catch(error => {
        setErrorMessage(error.message)
        console.log(errorMessage)
      })
  }

  return (
    <div>
      <h2>Create User Accounts</h2>
      <Form onSubmit={submit}>
        <CreateAccountDetails
          username={username}
          password={password}
          pin={pin}
          setUsername={setUsername}
          setPassword={setPassword}
          setPin={setPin}
        />
        <hr />
        <CreateAccountAddWallets
          currencies={currencies}
          tokens={tokens}
          setCurrencies={setCurrencies}
          setTokens={setTokens}
        />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

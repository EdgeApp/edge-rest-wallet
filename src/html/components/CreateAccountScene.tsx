import * as React from 'react'
import { Button, Form } from 'react-bootstrap'

import { createAcount } from '../lib/api'
import { CreateAccountAddWallets } from './CreateAccountAddWallets'
import { CreateAccountDetails } from './CreateAccountDetails'

type SubmitEvent = React.ChangeEvent<HTMLFormElement>

export const CreateAccountScene: React.FC<{}> = (): React.ReactElement => {
  const [username, setUsername] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [pin, setPin] = React.useState<string>('')
  const [currencies, setCurrencies] = React.useState<string[]>([])
  const [tokens, setTokens] = React.useState<string[]>([])
  const [successMessage, setSuccessMessage] = React.useState<string>('')
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const submit = (event: SubmitEvent): void => {
    event.preventDefault()
    createAcount({ username, password, pin })
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
      </Form>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </div>
  )
}

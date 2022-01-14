import 'bootstrap/dist/css/bootstrap.min.css'

import * as React from 'react'
import { Alert, Button, Form } from 'react-bootstrap'

import { createUser } from '../lib/api'
import { AddWalletTokens } from './AddWalletTokens'

type FormEvent = React.ChangeEvent<HTMLInputElement>
type SubmitEvent = React.ChangeEvent<HTMLFormElement>

export function CreateAccount(): React.FC<{}> {
  const [username, setUsername] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [pin, setPin] = React.useState<string>('')
  const [successMessage, setSuccessMessage] = React.useState<string>('')
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const handleUsername = (event: FormEvent): void =>
    setUsername(event.target.value)
  const handlePassword = (event: FormEvent): void =>
    setPassword(event.target.value)
  const handlePin = (event: FormEvent): void => {
    const pin = event.target.value

    // Cut PIN to 4 when PIN is greater than 4
    if (pin.length > 4) return

    // Change pin only when input is numbers
    if (/^\d+$/.test(pin) || pin.length === 0) {
      setPin(event.target.value)
    }
  }

  const submit = (event: SubmitEvent): void => {
    event.preventDefault()
    createUser({ username, password, pin })
      .then((message: string) => {
        setSuccessMessage(message)
        console.log(successMessage)
      })
      .catch(error => {
        console.log(error.message)
        setErrorMessage(error.message)
      })
  }

  return (
    <div>
      <h2>Create User Account</h2>
      <Form onSubmit={submit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Username"
            onChange={handleUsername}
            value={username}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            onChange={handlePassword}
            value={password}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Pin</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter PIN"
            onChange={handlePin}
            value={pin}
          />
        </Form.Group>
        <Button variant="primary" onClick={submit}>
          Submit
        </Button>
      </Form>
      {errorMessage != null && errorMessage !== '' && (
        <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
          <Alert.Heading>{errorMessage}</Alert.Heading>
        </Alert>
      )}
      <hr />
      <AddWalletTokens />
    </div>
  )
}

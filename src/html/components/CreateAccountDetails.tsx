import * as React from 'react'
import Form from 'react-bootstrap/Form'

interface Props {
  username: string
  password: string
  pin: string
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  setPin: (pin: string) => void
}

type FormEvent = React.ChangeEvent<HTMLInputElement>

export const CreateAccountDetails: React.FC<Props> = (
  props
): React.ReactElement => {
  const { username, password, pin, setUsername, setPassword, setPin } = props
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

  return (
    <>
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
          type="text"
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
    </>
  )
}

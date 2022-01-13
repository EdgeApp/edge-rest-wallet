import * as React from 'react'
import { Button, Form } from 'react-bootstrap'

import { CreateAccountDetails } from './CreateAccountDetails'

type SubmitEvent = React.ChangeEvent<HTMLFormElement>

export const CreateAccountScene: React.FC<{}> = (): React.ReactElement => {
  const [username, setUsername] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [pin, setPin] = React.useState<string>('')

  const submit = (event: SubmitEvent): void => {
    event.preventDefault()
    console.log(username, password, pin)
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
      </Form>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </div>
  )
}

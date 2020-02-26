/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react'
import { Button, Form } from 'react-bootstrap'

interface MainSceneState {
  balances: []
  type: string
}

export class MainScene extends React.Component<{}, MainSceneState> {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      balances: []
    }
  }

  getBalances = (type: string): void => {
    fetch('http://localhost:8008/balances/?type=' + type, { method: 'GET' })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(balancesArray => {
        this.setState({ balances: balancesArray })
      })
      .catch(e => {
        console.log(e)
      })
    console.log('GetBalances is called', this.state.balances)
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    this.getBalances(this.state.type)
    console.log('Handle Click with type', this.state.type)
  }

  handleChange = (event: any): void => {
    const value = event.target.value
    this.setState({ type: value })
  }

  render(): React.ReactNode {
    return (
      <div>
        <h1> Edge Rest Wallet </h1>
        <p> App </p>
        <Form>
          <Form.Group>
            <Form.Label>Wallet Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Wallet Type"
              value={this.state.type}
              onChange={this.handleChange}
            />
            <Form.Text className="text-muted">
              Please use a valid wallet type.
            </Form.Text>
          </Form.Group>
        </Form>
        <Button variant="primary" type="submit" onClick={this.handleClick}>
          Get Balances
        </Button>
        <div>Here are balances: {JSON.stringify(this.state.balances)}</div>
      </div>
    )
  }
}

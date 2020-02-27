/* eslint-disable @typescript-eslint/no-empty-interface */
import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

interface MainSceneState {
  balances: {}
  type: string
  transactions: []
}

export class MainScene extends React.Component<{}, MainSceneState> {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      balances: {},
      transactions: []
    }
  }

  getTransactions = (type: string): void => {
    fetch('http://localhost:8008/transactions/?type=' + type, { method: 'GET' })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(transactionsArray => {
        this.setState({ transactions: transactionsArray })
      })
      .catch(e => {
        console.log(e)
      })
    console.log('GetTransactions is called', this.state.transactions)
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

  handleBalancesClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    this.getBalances(this.state.type)
    console.log('Handle Balances Click with type', this.state.type)
  }

  handleTransactionsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    this.getTransactions(this.state.type)
    console.log('Handle Transactions Click with type', this.state.type)
  }

  handleChange = (event: any): void => {
    const value = event.target.value
    this.setState({ type: value })
  }

  render(): React.ReactNode {
    const { transactions, balances, type } = this.state
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
              value={type}
              onChange={this.handleChange}
            />
            <Form.Text className="text-muted">
              Please use a valid wallet type.
            </Form.Text>
          </Form.Group>
        </Form>
        <Button
          variant="primary"
          type="submit"
          onClick={this.handleBalancesClick}
        >
          Get Balances
        </Button>
        <div>Here are balances: {JSON.stringify(balances)}</div>
        <Button
          variant="primary"
          type="submit"
          onClick={this.handleTransactionsClick}
        >
          Get Transactions
        </Button>
        <div>
          Here are transactions:
          <Container>
            <Row>
              <Col>Currency Code:</Col>
              <Col>Native Amount:</Col>
              <Col>Network Fee:</Col>
              <Col>Block Height:</Col>
              <Col>Transaction ID:</Col>
              <Col>Date:</Col>
            </Row>
            {transactions.map((transaction: any, index) => {
              return (
                <Row key={index}>
                  <Col>{transaction.currencyCode}</Col>
                  <Col>{transaction.nativeAmount}</Col>
                  <Col>{transaction.networkFee}</Col>
                  <Col>{JSON.stringify(transaction.blockHeight)}</Col>
                  <Col>{transaction.txid}</Col>
                  <Col>{JSON.stringify(new Date(transaction.date * 1000))}</Col>
                </Row>
              )
            })}
          </Container>
        </div>
      </div>
    )
  }
}

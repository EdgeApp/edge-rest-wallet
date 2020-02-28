/* eslint-disable @typescript-eslint/no-empty-interface */
import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { Button, Form } from 'react-bootstrap'

interface MainSceneState {
  balances: {}
  type: string
  transactions: []
  nativeAmount: string
  publicAddress: string
}

export class MainScene extends React.Component<{}, MainSceneState> {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      balances: {},
      transactions: [],
      nativeAmount: '',
      publicAddress: ''
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

  postTransactions = (
    type: string,
    nativeAmount: string,
    publicAddress: string
  ): void => {
    fetch('http://localhost:8008/spend/?type=' + type, {
      body: JSON.stringify({ spendTargets: [{ nativeAmount, publicAddress }] }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          this.getBalances(this.state.type)
          this.getTransactions(this.state.type)
        }
      })
      .catch(e => {
        console.log(e)
      })
    console.log('postTransactions is called')
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

  handleSpendClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    this.postTransactions(
      this.state.type,
      this.state.nativeAmount,
      this.state.publicAddress
    )
    console.log(
      'Handle Spend Click with type',
      this.state.type,
      'and native amount:',
      this.state.nativeAmount
    )
  }

  handleTypeChange = (event: any): void => {
    const value = event.target.value
    this.setState({ type: value })
  }

  handleSpendChange = (event: any): void => {
    const nativeAmount = event.target.value
    this.setState({ nativeAmount })
  }

  handleAddressChange = (event: any): void => {
    const publicAddress = event.target.value
    this.setState({ publicAddress })
  }

  render(): React.ReactNode {
    const {
      transactions,
      balances,
      type,
      nativeAmount,
      publicAddress
    } = this.state
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
              onChange={this.handleTypeChange}
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
        <Form>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="text"
              placeholder="0.00"
              name="nativeAmount"
              value={nativeAmount}
              onChange={this.handleSpendChange}
            />
            <Form.Text className="text-muted">
              Please enter an amount.
            </Form.Text>
            <Form.Label>Public Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Public Address"
              name="publicAddress"
              value={publicAddress}
              onChange={this.handleAddressChange}
            />
            <Form.Text className="text-muted">
              Please enter an amount.
            </Form.Text>
          </Form.Group>
        </Form>
        <Button variant="primary" type="submit" onClick={this.handleSpendClick}>
          Spend Transaction
        </Button>
        <div>To get a full list of transactions, click the button below:</div>
        <Button
          variant="primary"
          type="submit"
          onClick={this.handleTransactionsClick}
        >
          Get Transactions
        </Button>
        <div>
          <table className="table table-responsive text-wrap">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Currency Code:</th>
                <th>Native Amount:</th>
                <th>Network Fee:</th>
                <th>Block Height:</th>
                <th>Date:</th>
                <th>Transaction ID:</th>
              </tr>
            </thead>
            {transactions.map((transaction: any, index) => {
              return (
                <tbody key={index}>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{transaction.currencyCode}</td>
                    <td>{transaction.nativeAmount}</td>
                    <td>{transaction.networkFee}</td>
                    <td>{JSON.stringify(transaction.blockHeight)}</td>
                    <td>{JSON.stringify(new Date(transaction.date * 1000))}</td>
                    <td className="text-wrap span2">{transaction.txid}</td>
                  </tr>
                </tbody>
              )
            })}
          </table>
        </div>
      </div>
    )
  }
}

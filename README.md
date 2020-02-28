# edge-rest-wallet

> A REST API for storing & sending money, powered by Edge

This repository implements a simple API for accessing a wallet on a web server. This can be useful for automated payouts, promotions, e-commerce, and various similar things.

We make this code available for free, but it does require an Edge SDK API key. We recommend closing external ports for security to prevent outside access and should only be used on your local server. Please copy `config.sample.json` to `config.json` and add your API key in there.

## Install production

Install Node

```sh
sudo apt update -y
sudo apt install curl -y
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt install -y nodejs
```

Install Yarn

```sh
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

Clone Repo

```sh
git clone https://github.com/EdgeApp/edge-rest-wallet.git
```

## Manage server using forever-service

 You can then use `forever-service` or similar tools to install the software on your server machine.

```sh
# install:
sudo forever-service install edgeRest --script lib/index.js --start

# manage:
sudo service edgeRest restart
sudo service edgeRest stop

# uninstall:
sudo forever-service delete edgeRest
```

# Manual Testing

`curl http://localhost:80/balances/?type=bitcoin`

## API Docs

```sh
# get balances
$.get('/balances/?type=' + type)
  .then(function(d) {console.log(d)})
  {
    "balance": {"BTC": "1100"}
  }

# get transactions
$.get('/transactions/?type=' + type)
  .then(function(d) {console.log(d)})
  {
    [{"blockHeight":123456,
    "date":"2020-02-26T21:15:09.749Z",
    "txid":"XXXXX",
    "nativeAmount":"1100",
    "networkFee":"0",
    "currencyCode":"BTC"}]
  }

# spend
$.post('/spend/?type=' + type, ({ spendTargets: [{ nativeAmount, publicAddress }])
  .then(function(d) {console.log(d)})
  {
    [{"blockHeight":123456,
    "date":"2020-02-26T21:15:09.749Z",
    "txid":"XXXXX",
    "nativeAmount":"1100",
    "networkFee":"0",
    "currencyCode":"BTC"}]
  }
```

## REST API

To launch the REST API, just type `yarn start`.

You can also build the server code by running `yarn build`, which puts its output in the `lib` folder.

## Demo app

Run `yarn demo` to launch the demo app in your web browser.

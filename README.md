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

Do dependency installation with Yarn

```sh
yarn install
```

Make your own config.json from config.sample.json

```sh
cp config.sample.json config.json
```

Make sure to fill out the *apiKey*, *username* and *password* as those are required to run the API.
Username and Password is your edge wallet login credentials.

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

## Manual Testing

`curl http://localhost:80/balances/?type=bitcoin`

## API Docs

## Get a balance for a wallet
```sh
# Make sure to add the right type of cryptocurrency wallet plugins to your config.json file so you can access the type (Ex: "plugins": {"bitcoin": true})
$.get('http://localhost:$PORT/balances/?type=$TYPE')
  .then(function(d) {console.log(d)})

# balances example
await fetch('http://localhost:8008/balances/?type=bitcoin', { method: 'GET' })


# balances result
>    {"BTC": "1100"}
```
## Get a list of transactions for a wallet
```sh
$.get('http://localhost:$PORT/transactions/?type=$TYPE')
  .then(function(d) {console.log(d)})

# transactions example
await fetch('http://localhost:8008/transactions/?type=bitcoin', { method: 'GET' })

# transactions result
>  [{
>    [{"blockHeight":619132,
>    "date":1582751709.749,
>    "ourReceiveAddresses": [
            "3JVeTHattdtGBAzWskiLzjeuojTb4Rjuui"
        ]
>    "txid":"6e7dcff41bd6176e3573249ef8e5a6a0be79e26a911ee1ac01669f04714aac23",
>    "nativeAmount":"1100",
>    "networkFee":"0",
>    "currencyCode":"BTC"}]
>  }]
```
## Send cryptocurrency from a wallet to a public address
```sh
# nativeAmount is in satoshi so this will need to be multiplied by 100,000,000, see example for reference

$.post('http://localhost:$PORT/spend/?type=$TYPE', ({ spendTargets: [{ nativeAmount, publicAddress }])

# spend .000011 bitcoin to address 3JVeTHattdtGBAzWskiLzjeuojTb4Rjuui
await fetch('http://localhost:8008/spend/?type=bitcoin', {
  body: JSON.stringify({ spendTargets: [{ "1100", "3JVeTHattdtGBAzWskiLzjeuojTb4Rjuui" }] }),
  headers: {
    'Content-Type': 'application/json'
  },
  method: 'POST'
  })

# spend result
> {
>     "ourReceiveAddresses": [
>        "qqrzxway5u26205mzz5hk5mqerer9dxf8v0jqum5vf"
>    ],
>    "currencyCode": "BCH",
>    "txid": "2eea81e5bd42ad8ee5fde9a2923d3e8ec60914ae974071187aa197d4a45af341",
>    "date": 1583270341.543,
>    "blockHeight": 0,
>    "nativeAmount": "-11908",
>    "networkFee": "908",
>    "signedTx": "01000000011152fb90c4eeee7d97a7e4ec58647f0300c0d2a085e4cdfa291ae75865cebfd2010000006b48304502210099d8df18063a8ff865c7638bef8109e83067c8420cf06066bd6c93524392f01602202dc4e57174d3667b421afc3ae4ef1b1eaf12c23c3df74464f4ff3dbd18f118d04121020df58681fe35241fb04863933f47a148f72fab6040255d8059500968e1f5cb3cffffffff02f82a0000000000001976a9143a92370920c0a20f126a6778d1700eb9e970695b88ac355b1c00000000001976a91406233ba4a715a53e9b10a97b5360c8f232b4c93b88ac00000000"
>}
```

## REST API

To launch the REST API, just type `yarn start`.

You can also build the server code by running `yarn build`, which puts its output in the `lib` folder.

## Demo app

Run `yarn demo` to launch the demo app in your web browser.

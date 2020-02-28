# edge-rest-wallet

> A REST API for storing & sending money, powered by Edge

This repository implements a simple API for accessing a wallet on a web server. This can be useful for automated payouts, promotions, e-commerce, and various similar things.

We make this code available for free, but it does require an Edge SDK API key. Please copy `config.sample.json` to `config.json` and add your API key in there.

## Setup

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

## REST API

To launch the REST API, just type `yarn start`.

You can also build the server code by running `yarn build`, which puts its output in the `lib` folder. You can then use `forever-service` or similar tools to install the software on your server machine.

```sh
# install:
sudo forever-service install wallet --script lib/index.js --start

# manage:
sudo service wallet restart
sudo service wallet stop

# uninstall:
sudo forever-service delete wallet
```

## Demo app

Run `yarn demo` to launch the demo app in your web browser.

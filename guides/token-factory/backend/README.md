# Getting Started with klayr Blockchain Client

This project was bootstrapped with [klayr SDK](https://github.com/klayrHQ/klayr-sdk)

### Start a node

```
./bin/run start
npm run build && ./bin/run start --config config/custom_config.json --overwrite-config
```

### Commands

```
./bin/run transaction:create tokenFactory createToken 10000000 --params='{"name":"The real pepe", "symbol": "PEPE2", "totalSupply": 1900000}' --json --pretty

./bin/run transaction:create tokenFactory mint 10000000 --params='{"tokenID": "1234567800000001", "amount": "222222222", "recipient": "kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --json --pretty

./bin/run transaction:create tokenFactory burn 10000000 --params='{"tokenID": "1234567800000001", "amount": "9999", "recipient": "kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --json --pretty

./bin/run endpoint:invoke token_getBalances '{"address":"kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --pretty
./bin/run endpoint:invoke token_getBalance '{"tokenID": "1234567800000000", "address":"kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --pretty
```

### Info plugin

#### Get all tokens

```
./bin/run endpoint:invoke tokenFactoryInfo_getTokenList --pretty
```

#### Get all tokens for address

```
./bin/run endpoint:invoke tokenFactoryInfo_getTokenList '{"address": "kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --pretty
```

### Add a new module

```
klayr generate:module ModuleName
// Example
klayr generate:module token
```

### Add a new command

```
klayr generate:command ModuleName Command
// Example
klayr generate:command token transfer
```

### Add a new plugin

```
klayr generate:plugin PluginName
// Example
klayr generate:plugin httpAPI
```

## Learn More

You can learn more in the [documentation](https://klayr.com/documentation/klayr-sdk/).

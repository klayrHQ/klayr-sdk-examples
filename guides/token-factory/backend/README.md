# Getting Started with klayr Blockchain Client

This project was bootstrapped with [klayr SDK](https://github.com/klayrHQ/klayr-sdk)

### Start a node

```
./bin/run start
npm run build && ./bin/run start --config config/custom_config.json --overwrite-config
```

### Commands

```
./bin/run transaction:create tokenFactory createToken 10000000 --params='{"name":"The real pepe", "symbol": "PEPE", "totalSupply": 100000}' --json --pretty

./bin/run transaction:create tokenFactory mint 10000000 --params='{"tokenID": "1234567800000001", "amount": "100000000", "recipient": "kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --json --pretty

./bin/run endpoint:invoke token_getBalances '{"address":"kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --pretty
./bin/run endpoint:invoke token_getBalance '{"tokenID": "1234567800010000", "address":"kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --pretty
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

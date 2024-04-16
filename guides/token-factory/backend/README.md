# Getting Started with Lisk Blockchain Client

This project was bootstrapped with [Lisk SDK](https://github.com/LiskHQ/lisk-sdk)

### Start a node

```
./bin/run start
npm run build && ./bin/run start --config config/custom_config.json --overwrite-config
```

### Commands

```
./bin/run transaction:create tokenFactory createToken 10000000 --params='{"name":"The real pepe", "symbol": "PEPE", "totalSupply": 100000}' --json --pretty

./bin/run transaction:create tokenFactory mint 10000000 --params='{"tokenID": "1234567800000001", "amount": "100000000", "recipient": "lsk9gaw9ubd5q35v3mksnokpqf3stahe89uderojq"}' --json --pretty

./bin/run endpoint:invoke token_getBalances '{"address":"lsk9gaw9ubd5q35v3mksnokpqf3stahe89uderojq"}' --pretty
./bin/run endpoint:invoke token_getBalance '{"tokenID": "1234567800010000", "address":"lsk9gaw9ubd5q35v3mksnokpqf3stahe89uderojq"}' --pretty
```

### Add a new module

```
lisk generate:module ModuleName
// Example
lisk generate:module token
```

### Add a new command

```
lisk generate:command ModuleName Command
// Example
lisk generate:command token transfer
```

### Add a new plugin

```
lisk generate:plugin PluginName
// Example
lisk generate:plugin httpAPI
```

## Learn More

You can learn more in the [documentation](https://lisk.com/documentation/lisk-sdk/).

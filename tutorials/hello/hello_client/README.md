# Getting Started with Klayr Blockchain Client

This project was bootstrapped with [Klayr SDK](https://github.com/Klayrhq/klayr-sdk)

### Install packages

```
npm install
```

### Build the code

```
npm run build
```

### Start a node

```
./bin/run start --config=config/custom_config.json  --overwrite-config
```

### Add a new module

```
klayr generate:module ModuleName
// Example
klayr generate:module hello
```

### Add a new plugin

```
klayr generate:plugin PluginName
// Example
klayr generate:plugin helloInfo
```

## Learn More

You can learn more in the [documentation](https://klayr.xyz/documentation/klayr-sdk/).

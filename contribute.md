## Develop

### instantiateMsg

1. cw20-base
```
"instantiateMsg": {
    "name": "Cool",
    "symbol": "WUT",
    "decimals": 3,
    "initial_balances": [
    {
        "address": "terra1ccgfzama5y26es8xhlhcswtp76e9jcddhqhchl",
        "amount": "50000"
    }
    ],
    "mint": {
    "minter": "terra1t3gt92tpgm7dzqcf2dp3n3gncvzfjgech84h8u",
    "cap": "511223344"
    },
    "marketing": null
}
```

2. cw20-staking
```
"instantiateMsg": {
  "name": "Cool",
  "symbol": "WUT",
  "decimals": 3,
  "unbonding_period": {
    "time" : 86400
  },
  "exit_tax": "1",
  "min_withdrawal": "10",
  "validator": "terravaloper1vf2209f5y7s4a66n5ng7wmup5gcc2kghhzy89w"
}
```

### mint
```
{
  "mint": {
    "recipient": "terra1t3gt92tpgm7dzqcf2dp3n3gncvzfjgech84h8u",
    "amount": "10000"
  }
}
```

### bond
Bond will bond all staking tokens sent with the message and release derivative tokens
```
{
  "bond": {}
}
```

### reinvest
Reinvest will check for all accumulated rewards, withdraw them, and re-bond them to the same validator. Anyone can call this, which updates the value of the token (how much under custody).

```
{
  "reinvest": {}
}
```

### trinsfer
Implements CW20. Transfer is a base message to move tokens to another account without triggering actions
```
{
  "transfer" : {
    "amount": "100",
    "recipient": "terra1ccgfzama5y26es8xhlhcswtp76e9jcddhqhchl"
  }
}
```

### burn
Implements CW20. Burn is a base message to destroy tokens forever
```
{
  "burn": {
    "amount": "1000"
  }
}
```


## deploy

#### testnet

- CW20-base
```
terrain deploy cw20-base --signer bombay --network testnet
```

- response
```
- events:
    - type: instantiate_contract
      attributes:
        - key: creator
          value: terra1ccgfzama5y26es8xhlhcswtp76e9jcddhqhchl
        - key: admin
        - key: code_id
          value: "50733"
        - key: contract_address
          value: terra19w3j4kzjlph96la5d0ra62v4xqx2vvg6uhqkz5
    - type: message
      attributes:
        - key: action
          value: /terra.wasm.v1beta1.MsgInstantiateContract
        - key: module
          value: wasm
        - key: sender
          value: terra1ccgfzama5y26es8xhlhcswtp76e9jcddhqhchl
```

- CW20-staking
```
terrain deploy cw20-staking --signer bombay --network testnet
```
- response
```
"cw20-staking": {
      "codeId": "50910",
      "contractAddresses": {
        "default": "terra1e9y002yl53pkyynu6e755thng7l5xksvkafnqr"
      }
    }
```

#### localterra
Deploy
```
terrain deploy cw20-base --signer validator
```

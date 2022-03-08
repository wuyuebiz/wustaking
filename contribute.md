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

### mint
```
{
  "mint": {
    "recipient": "terra1t3gt92tpgm7dzqcf2dp3n3gncvzfjgech84h8u",
    "amount": 10000
  }
}
```

### deploy

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


#### localterra
Deploy
```
terrain deploy cw20-base --signer validator
```

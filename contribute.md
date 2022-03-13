## Develop

### instantiateMsg

1. cw20-base
```
{
    "name": "MINION Token",
    "symbol": "MINION",
    "decimals": 3,
    "initial_balances": [
        {
            "address": "terra1ccgfzama5y26es8xhlhcswtp76e9jcddhqhchl",
            "amount": "10000"
        },
        {
            "address": "terra1t3gt92tpgm7dzqcf2dp3n3gncvzfjgech84h8u",
            "amount": "10000"
        },
       {
            "address": "terra1dcegyrekltswvyy0xy69ydgxn9x8x32zdtapd8",
            "amount": "10000"
        }
    ]
}
```

```
code_id	148
contract_address	
terra1pvl9dymgf5nahrc85yqqucytlhjk0xv3wnztca
```

2. cw20-staking
```
"instantiateMsg": {
  "name": "mCool",
  "symbol": "mWUT",
  "decimals": 3,
  "unbonding_period": {
    "time" : 86400
  },
  "exit_tax": "1",
  "min_withdrawal": "10",
  "validator": "terravaloper1vf2209f5y7s4a66n5ng7wmup5gcc2kghhzy89w"
}
```

3. lp-staking
```
"instantiateMsg": {
  "distribution_schedule": [
    [
      1633014000,
      1664550000,
      "5000000"
    ],
    [
      1664550000,
      1696086000,
      "4000000"
    ],
    [
      1696086000,
      1727708400,
      "3000000"
    ],
    [
      1727708400,
      1759244400,
      "2000000"
    ],
    [
      1759244400,
      1790780400,
      "1000000"
    ]
  ],
  "wut_lp_token": "terra18e4mudt7kdml6lma5fhsydszxpexmxf2ez9hpn",
  "wut_token": "terra1pvl9dymgf5nahrc85yqqucytlhjk0xv3wnztca"
}
```

```
code_id	52218
contract_address	
terra1j50hhzmg6rm5rm7vqljgc3e40d33mkj334x6t7
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
- CW20-staking
```
terrain deploy cw20-staking --signer bombay --network testnet
```

- wut-lp-staking
```
terrain deploy wut-lp-staking --signer bombay --network testnet
```
- response


#### localterra
Deploy
```
terrain deploy cw20-base --signer validator
```


### generate own pair
https://docs.terraswap.io/docs/howto/create_your_own_pair/
https://docs.terraswap.io/docs/contract_resources/contract_addresses/
```
{
  "asset_infos": [
    {
      "native_token": {
        "denom": "uusd"
      }
    },
    {
      "token": {
        "contract_addr": "terra1pvl9dymgf5nahrc85yqqucytlhjk0xv3wnztca"
      }
    }
  ],
  "init_hook": {
    "contract_addr": "terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf",
    "msg": "eyJjcmVhdGVfcGFpciI6eyJhc3NldF9pbmZvcyI6W3sidG9rZW4iOnsiY29udHJhY3RfYWRkciI6InRlcnJhMXB2bDlkeW1nZjVuYWhyYzg1eXFxdWN5dGxoamsweHYzd256dGNhIn19LHsibmF0aXZlX3Rva2VuIjp7ImRlbm9tIjoidXVzZCJ9fV19fQ=="
  },
  "token_code_id": 148,
"pair_code_id": 155
}
```

```
code_id	154
contract_address	
terra1gw5pacpvhswlv5twgmgfjrj9ys5gvrjuxgdsk7
```
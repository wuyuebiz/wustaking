## Develop

### instantiateMsg

1. cw20-base
```
{
    "name": "MINION Token",
    "symbol": "MINION",
    "decimals": 6,
    "initial_balances": [
        {
            "address": "terra1ccgfzama5y26es8xhlhcswtp76e9jcddhqhchl",
            "amount": "10000000000"
        },
        {
            "address": "terra1t3gt92tpgm7dzqcf2dp3n3gncvzfjgech84h8u",
            "amount": "10000000000"
        },
       {
            "address": "terra1dcegyrekltswvyy0xy69ydgxn9x8x32zdtapd8",
            "amount": "10000000000"
        }
    ]
}
```

```
code_id	148
contract_address	
terra13yu4fnc4p7lrenplschvkt5wjsn4mx6exqy22u
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
      "5000000000"
    ],
    [
      1664550000,
      1696086000,
      "4000000000"
    ],
    [
      1696086000,
      1727708400,
      "3000000000"
    ],
    [
      1727708400,
      1759244400,
      "2000000000"
    ],
    [
      1759244400,
      1790780400,
      "1000000000"
    ]
  ],
  "wut_lp_token": "terra18ep0a23yayzr9ql0upcws52r0j4uddd9gaps87",
  "wut_token": "terra13yu4fnc4p7lrenplschvkt5wjsn4mx6exqy22u"
}
```

```
creator	
terra1t3gt92tpgm7dzqcf2dp3n3gncvzfjgech84h8u
admin	
code_id	53035
contract_address	
terra1umsa66au0ytxdpdu2gc4mq7rh80was4e2hvpnl
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
      "token": {
        "contract_addr": "terra13yu4fnc4p7lrenplschvkt5wjsn4mx6exqy22u"
      }
    },
    {
      "native_token": {
        "denom": "uusd"
      }
    }
  ],
  "token_code_id": 148,
  "init_hook": {
    "msg": {
      "register": {
        "asset_infos": [
          {
            "token": {
              "contract_addr": "terra13yu4fnc4p7lrenplschvkt5wjsn4mx6exqy22u"
            }
          },
          {
            "native_token": {
              "denom": "uusd"
            }
          }
        ]
      }
    },
    "contract_addr": "terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf"
  }
}
```

```
contract_address	
terra13ms56et4nchgeq0l4e7sjxx8wugguptqjn53re
liquidity_token_addr	
terra18ep0a23yayzr9ql0upcws52r0j4uddd9gaps87
```


wu address
terra1t3gt92tpgm7dzqcf2dp3n3gncvzfjgech84h8u
bombay
terra1ccgfzama5y26es8xhlhcswtp76e9jcddhqhchl
test1
terra1dcegyrekltswvyy0xy69ydgxn9x8x32zdtapd8




queries

```
{
    "allowance": {
        "owner": "terra1dcegyrekltswvyy0xy69ydgxn9x8x32zdtapd8",
        "spender": "terra1t3gt92tpgm7dzqcf2dp3n3gncvzfjgech84h8u"
    }
}
```

```
{
    "increase_allowance": {
        "spender": "terra13ms56et4nchgeq0l4e7sjxx8wugguptqjn53re",
        "amount": "10000000000",
        "expires": {
            "never": {}
        }
    }
}
```

```
{
  "provide_liquidity": {
    "assets": [
      {
        "info" : {
            "token": {
                "contract_addr": "terra13yu4fnc4p7lrenplschvkt5wjsn4mx6exqy22u"
            }
        },
        "amount": "1000000000"
      },
      {
        "info" : {
            "native_token": {
                "denom": "uusd"
            }
        },
        "amount": "1000000000"
      }
    ]
  }
}
```
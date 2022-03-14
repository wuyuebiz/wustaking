import { TokenDenomEnum, TokenSymbolEnum } from 'types'

const TERRA_DECIMAL = 1e6
const MINION_DECIMAL = 1e3

const symbolOfDenom: Record<TokenDenomEnum, TokenSymbolEnum> = {
  [TokenDenomEnum.uusd]: TokenSymbolEnum.UST,
  [TokenDenomEnum.uluna]: TokenSymbolEnum.Luna,
}

export default {
  symbolOfDenom,
  TERRA_DECIMAL,
  MINION_DECIMAL,
}

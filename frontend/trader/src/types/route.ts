export enum RoutePath {
  home = '/home',

  lpTower = '/lpTower',

  minion_paper = '/minion_paper',

  say_minion = '/say_minion',

  send = '/send',
}

export enum TradeTypeEnum {
  buy = 'buy',
  sell = 'sell',
}

export enum LpProvideTypeEnum {
  provide = 'provide',
  withdraw = 'withdraw',
}

export enum LpStakeTypeEnum {
  stake = 'stake',
  unstake = 'unstake',
}

export type RouteParams = {
  [RoutePath.home]: {
    tradeType: TradeTypeEnum
    lpType: LpProvideTypeEnum
    symbol: string
  }
  [RoutePath.lpTower]: {
    lpProvideType: LpProvideTypeEnum
    lpStakeType: LpStakeTypeEnum
    lpOfLpIndex: string
    lpStakingIndex: string
  }
  [RoutePath.minion_paper]: undefined
  [RoutePath.say_minion]: undefined
  [RoutePath.send]: undefined
}

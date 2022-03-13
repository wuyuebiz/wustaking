import { CSSProperties, useState, useEffect, useMemo } from 'react'

import { BURN, COLOR, UTIL } from 'consts'

import {
  burnMemoType,
  ContractAddr,
  CW20,
  SayOptionEnum,
  TokenType,
  uCW20,
  uToken,
} from 'types'

import useBurn, { UseBurnReturn } from 'hooks/common/useBurn'
import useCw20Info from 'hooks/query/token/useCw20Info'
import usePool from 'hooks/query/pair/usePool'

export type UseSayMinionReturn = {
  burnedAmount: uCW20
  burnedPrice: uCW20
  onClickMinion: () => void
  memoOptions: {
    value: SayOptionEnum
    label: string
  }[]
  burnReturn: UseBurnReturn
  inputMemo: string
  setInputMemo: (value: string) => void
  onChangeOption: (value: SayOptionEnum) => void
}

export const getAmount = (option: SayOptionEnum): string => {
  return BURN.optionBurnAmount[option]
}

export const getMemoStyle = ({
  type,
  amount,
}: {
  type: SayOptionEnum
  amount: uToken
}): CSSProperties => {
  const bn = UTIL.toBn(UTIL.demicrofy(amount))

  const isValid = (
    targetType: SayOptionEnum,
    inputType: SayOptionEnum
  ): boolean => inputType === targetType && bn.gte(getAmount(targetType))

  if (isValid(SayOptionEnum.PLACEBO_RAFFLE_1, type)) {
    return {
      color: COLOR.placebo.primary_2,
      backgroundColor: COLOR.placebo.primary_1,
    }
  } else if (isValid(SayOptionEnum.init_name, type)) {
    return {
      color: COLOR.primary._200,
      backgroundColor: COLOR.gray._100,
      fontSize: 20,
    }
  } else if (isValid(SayOptionEnum.change_name, type)) {
    return {
      color: COLOR.gray._100,
      backgroundColor: COLOR.gray._600,
      fontSize: 20,
    }
  } else if (isValid(SayOptionEnum.rank_1, type)) {
    return { color: COLOR.rainbow.red, fontSize: 32 }
  } else if (isValid(SayOptionEnum.rank_2, type)) {
    return { color: COLOR.rainbow.orang, fontSize: 28 }
  } else if (isValid(SayOptionEnum.rank_3, type)) {
    return { color: COLOR.rainbow.yellow, fontSize: 26 }
  } else if (isValid(SayOptionEnum.rank_4, type)) {
    return { color: COLOR.rainbow.green, fontSize: 24 }
  } else if (isValid(SayOptionEnum.rank_5, type)) {
    return { color: COLOR.rainbow.blue, fontSize: 22 }
  } else if (isValid(SayOptionEnum.rank_6, type)) {
    return { color: COLOR.rainbow.navy, fontSize: 20 }
  } else {
    return { color: COLOR.rainbow.violet, fontSize: 18 }
  }
}

export const burnDataParser = ({
  data,
  name,
}: {
  data: string
  name: string
}): {
  type: SayOptionEnum
  displayMsg: string
} => {
  const json = UTIL.jsonTryParse<burnMemoType>(data)
  let displayMsg = data
  let type = '' as SayOptionEnum

  if (json) {
    type = json.type

    if ('name' in json) {
      if (type === SayOptionEnum.init_name) {
        displayMsg = `🎉 You got a Name~! Welcome ${json.name}`
      } else if (type === SayOptionEnum.change_name) {
        displayMsg = `💡 ${name} got a new name`
      }
    } else {
      displayMsg = json.msg
    }
  }

  return {
    type,
    displayMsg,
  }
}

const useSayMinion = ({
  MINIONToken,
}: {
  MINIONToken: TokenType
}): UseSayMinionReturn => {
  const memoOptions = [
    // {
    //   value: SayOptionEnum.PLACEBO_RAFFLE_1,
    //   label: `${getAmount(SayOptionEnum.PLACEBO_RAFFLE_1)} MINION PLACEBO RAFFLE`,
    // },
    {
      value: SayOptionEnum.rank_7,
      label: `${getAmount(SayOptionEnum.rank_7)} MINION`,
    },
    {
      value: SayOptionEnum.rank_6,
      label: `${getAmount(SayOptionEnum.rank_6)} MINION`,
    },
    {
      value: SayOptionEnum.rank_5,
      label: `${getAmount(SayOptionEnum.rank_5)} MINION`,
    },
    {
      value: SayOptionEnum.rank_4,
      label: `${getAmount(SayOptionEnum.rank_4)} MINION`,
    },
    {
      value: SayOptionEnum.rank_3,
      label: `${getAmount(SayOptionEnum.rank_3)} MINION`,
    },
    {
      value: SayOptionEnum.rank_2,
      label: `${getAmount(SayOptionEnum.rank_2)} MINION`,
    },
    {
      value: SayOptionEnum.rank_1,
      label: `${getAmount(SayOptionEnum.rank_1)} MINION`,
    },
  ]

  const burnReturn = useBurn({ token: MINIONToken })
  const { tokenInfo } = useCw20Info({
    token: MINIONToken.contractOrDenom as ContractAddr,
  })

  const { poolInfo } = usePool({
    pairContract: MINIONToken.pairList[0].pair,
    token_0_ContractOrDenom: MINIONToken.contractOrDenom,
  })
  const burnedAmount = useMemo(() => {
    console.log(tokenInfo, '======')
    const cap = UTIL.toBn(511223344).multipliedBy(1e3)
    return cap
      .minus(tokenInfo?.total_supply || '0')
      .toString(10) as uCW20
  }, [tokenInfo?.total_supply])

  const burnedPrice = useMemo(() => {
    const price = UTIL.toBn(burnedAmount).multipliedBy(
      poolInfo?.token_0_Price || 0
    )
    return price.toString(10) as uCW20
  }, [burnedAmount, poolInfo?.token_0_Price])

  const [burnOption, setBurnOption] = useState<SayOptionEnum>(
    memoOptions[0].value
  )
  const onChangeOption = (value: SayOptionEnum): void => {
    setBurnOption(value)
    burnReturn.setAmount(getAmount(value) as CW20)
  }

  const [inputMemo, setInputMemo] = useState('')

  const onClickMinion = (): void => {
    burnReturn.burnToken()
  }

  useEffect(() => {
    const burnMemo: burnMemoType = {
      type: burnOption,
      msg: inputMemo,
    }
    burnReturn.setMemo(JSON.stringify(burnMemo))
    return (): void => {
      burnReturn.setMemo(JSON.stringify(burnMemo))
    }
  }, [burnOption, inputMemo])

  useEffect(() => {
    onChangeOption(memoOptions[0].value)
  }, [])

  return {
    burnedAmount,
    burnedPrice,
    onClickMinion,
    memoOptions,
    burnReturn,
    inputMemo,
    setInputMemo,
    onChangeOption,
  }
}

export default useSayMinion

import { useState, useMemo, useEffect } from 'react'
import { CreateTxOptions, MsgExecuteContract, Fee } from '@terra-money/terra.js'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { useRecoilValue } from 'recoil'

import {
  uToken,
  Token,
  uNative,
  Native,
  uUST,
  PostTxStatus,
  TokenDenomEnum,
  ContractAddr,
} from 'types'
import { TradeSimulation } from 'types/tradeSimulation'

import { DEV, MESSAGE, UTIL } from 'consts'

import usePostTx from '../usePostTx'
import postTxStore from 'store/postTxStore'
import useCalcFee from '../useCalcFee'
import useFabricator from '../useFabricator'
import useMyBalance from '../useMyBalance'
import useSimulate from 'hooks/query/token/useSimulate'

import { sellFromSimulator, sellToSimulator } from 'logics/tradeSimulator'
import { useDebouncedCallback } from 'use-debounce/lib'
import {
  validateFee,
  validateFormInputAmount,
  validateFormInputAmountDecimal,
  validateSlippage,
} from 'logics/validator'

export type UseSellReturn = {
  fromTokenContractOrDenom: ContractAddr | TokenDenomEnum
  toTokenContractOrDenom: ContractAddr | TokenDenomEnum
  fromTokenSymbol: string
  toTokenSymbol: string

  slippage: string
  updateSlippage: (value: string) => void

  fromAmount: Token
  updateFromAmount: (value: Token) => void
  fromAmountErrMsg: string
  toAmount: Native
  updateToAmount: (value: Native) => void
  toAmountErrMsg: string

  fee?: Fee
  simulation?: TradeSimulation<uToken, uNative>

  onClickSell: () => void
  invalidForm: boolean
  submitErrMsg: string
}

const useSell = ({
  fromTokenContractOrDenom,
  toTokenContractOrDenom,
  fromTokenSymbol,
  toTokenSymbol,
  pairContract,
}: {
  fromTokenContractOrDenom: ContractAddr | TokenDenomEnum
  toTokenContractOrDenom: ContractAddr | TokenDenomEnum
  fromTokenSymbol: string
  toTokenSymbol: string
  pairContract: ContractAddr
}): UseSellReturn => {
  const { balance: uusdBal } = useMyBalance({
    contractOrDenom: TokenDenomEnum.uusd,
  })

  const { balance: ofromTokenBal } = useMyBalance({
    contractOrDenom: fromTokenContractOrDenom,
  })

  const { getSwapMsgs } = useFabricator()
  const connectedWallet = useConnectedWallet()

  const [simulation, setSimulation] =
    useState<TradeSimulation<uToken, uNative>>()
  const [simulationErrMsg, setSimulationErrMsg] = useState('')
  const { simulate, reverseSimulate } = useSimulate()

  const [slippage, setSlippage] = useState<string>('0.01')

  const postTxResult = useRecoilValue(postTxStore.postTxResult)
  const { postTx } = usePostTx()

  const walletAddress = connectedWallet?.walletAddress as string

  const [fromAmount, setFromAmount] = useState('' as Token)
  const fromAmountErrMsg = useMemo(() => {
    const myTokenAmount = UTIL.demicrofy(ofromTokenBal)
    return validateFormInputAmount({
      input: fromAmount,
      max: myTokenAmount,
    })
  }, [fromAmount])

  const [toAmount, setToAmount] = useState('' as Native)
  const toAmountErrMsg = useMemo(() => {
    return validateFormInputAmountDecimal({
      input: toAmount,
    })
  }, [toAmount])

  const invalidForm =
    postTxResult.status === PostTxStatus.BROADCAST ||
    fromAmount.trim() === '' ||
    !!fromAmountErrMsg ||
    !!toAmountErrMsg

  const txOptions: CreateTxOptions = useMemo(() => {
    let msgs: MsgExecuteContract[] = []
    const beliefPrice =
      simulation?.beliefPrice && UTIL.demicrofy(simulation.beliefPrice)

    if (Number(fromAmount) > 0 && UTIL.toBn(beliefPrice).gt(0)) {
      msgs = getSwapMsgs({
        fromAmount,
        fromTokenContractOrDenom,
        pairContract,
        maxSpread: slippage,
        beliefPrice,
      })
    }
    return {
      msgs,
      feeDenoms: ['uusd'],
    }
  }, [walletAddress, fromAmount, simulation, slippage])

  const { fee } = useCalcFee({
    isValid: !invalidForm,
    txOptions,
  })

  const dbcSimulateFromAmount = useDebouncedCallback(
    async (nextFromUAmount: uToken) => {
      try {
        const simulated = await simulate({
          pairContract,
          tokenContract: fromTokenContractOrDenom,
          amount: nextFromUAmount,
        })
        if (simulated) {
          const simulation = sellFromSimulator({
            simulated,
            fromAmount: nextFromUAmount,
            maxSpread: slippage,
          })
          setSimulation(simulation)
          const _toAmount = simulation?.toAmount || ('0' as uNative)
          setToAmount(UTIL.demicrofy(_toAmount) as Native)
        }
      } catch (e) {
        setSimulationErrMsg(MESSAGE['Simulation failed'])
        DEV.log('dbcSimulateFromAmount', e)
      }
    },
    400
  )

  const updateFromAmount = async (nextFromAmount: Token): Promise<void> => {
    setSimulation(undefined)
    setSimulationErrMsg('')
    setFromAmount(nextFromAmount.trim() as Token)
    setToAmount('' as Native)
    const nextFromUAmount = UTIL.microfy(nextFromAmount) as uToken
    dbcSimulateFromAmount(nextFromUAmount)
  }
  const dbcSimulateToAmount = useDebouncedCallback(
    async (nextToUAmount: uNative) => {
      try {
        const simulated = await reverseSimulate<uNative, uToken>({
          amount: nextToUAmount,
          pairContract,
          tokenContract: toTokenContractOrDenom,
        })
        if (simulated) {
          const simulation = sellToSimulator({
            simulated,
            toAmount: nextToUAmount,
            maxSpread: slippage,
          })
          setSimulation(simulation)
          setFromAmount(
            UTIL.demicrofy(simulation?.fromAmount || ('0' as uToken)) as Token
          )
        }
      } catch (e) {
        setSimulationErrMsg(MESSAGE['Simulation failed'])
        DEV.log('dbcSimulateFromAmount', e)
      }
    },
    400
  )

  const updateToAmount = async (nextToAmount: Native): Promise<void> => {
    setSimulation(undefined)
    setSimulationErrMsg('')
    setToAmount(nextToAmount.trim() as Native)
    setFromAmount('' as Token)
    const nextToUAmount = UTIL.microfy(nextToAmount) as uNative
    dbcSimulateToAmount(nextToUAmount)
  }

  const updateSlippage = (value: string): void => {
    setSlippage(value)
    setSimulation(undefined)
    setSimulationErrMsg('')
    dbcSimulateFromAmount(UTIL.microfy(fromAmount) as uToken)
  }
  const submitErrMsg =
    useMemo(() => {
      let msg = ''

      if (fee) {
        const availableUusd = UTIL.toBn(uusdBal).toFixed(0) as uUST

        msg = validateFee({ availableUusd, fee })
      }

      const validateSlippageReturn = validateSlippage({
        slippage,
      })

      if (validateSlippageReturn.status === 'error') {
        msg = validateSlippageReturn.message
      }

      return msg
    }, [fee, fromAmount, slippage]) || simulationErrMsg

  const onClickSell = (): void => {
    postTx({ txOptions: { ...txOptions, fee } })
  }

  const initForm = (): void => {
    updateFromAmount('' as Token)
  }

  useEffect(() => {
    updateFromAmount(fromAmount)
  }, [pairContract])

  useEffect(() => {
    if (postTxResult.status === PostTxStatus.DONE) {
      initForm()
    }
  }, [postTxResult.status])

  return {
    fromTokenContractOrDenom,
    toTokenContractOrDenom,
    fromTokenSymbol,
    toTokenSymbol,

    slippage,
    updateSlippage,

    fromAmount,
    updateFromAmount,
    fromAmountErrMsg,
    toAmount,
    updateToAmount,
    toAmountErrMsg,

    fee,
    simulation,
    onClickSell,
    invalidForm,
    submitErrMsg,
  }
}

export default useSell

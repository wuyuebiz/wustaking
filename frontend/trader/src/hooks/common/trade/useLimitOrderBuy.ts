import { useState, useMemo, useEffect } from 'react'
import { CreateTxOptions, MsgExecuteContract, Fee } from '@terra-money/terra.js'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { useRecoilValue } from 'recoil'

import { UTIL } from 'consts'

import {
  Token,
  uUST,
  PostTxStatus,
  TokenDenomEnum,
  ContractAddr,
  TokenType,
} from 'types'

import usePostTx from '../usePostTx'
import postTxStore from 'store/postTxStore'
import useCalcFee from '../useCalcFee'
import useFabricator from '../useFabricator'
import useMyBalance from '../useMyBalance'

import {
  validateFee,
  validateFormInputAmount,
  validateFormInputAmountDecimal,
} from 'logics/validator'
import useNetwork from '../useNetwork'
import usePool from 'hooks/query/pair/usePool'

export type UseLimitOrderBuyReturn = {
  askTokenPrice: Token
  offerDenom: ContractAddr | TokenDenomEnum
  askContractOrDenom: ContractAddr | TokenDenomEnum
  offerTokenSymbol: string
  askTokenSymbol: string

  offerAmount: Token
  offerAmountErrMsg: string

  askAmount: Token
  updateAskAmount: (value: Token) => void
  askAmountErrMsg: string
  askPrice: Token
  updateAskPrice: (value: Token) => void
  askPriceErrMsg: string

  MINIONToken: TokenType
  MINIONAmount: Token
  setMINIONAmount: (value: Token) => void
  MINIONAmountErrMsg: string

  fee?: Fee

  onClickLimitOrderBuy: () => void
  invalidForm: boolean
  submitErrMsg: string
}

const useLimitOrderBuy = ({
  offerDenom,
  askContractOrDenom,
  offerTokenSymbol,
  askTokenSymbol,
  pairContract,
}: {
  offerDenom: ContractAddr | TokenDenomEnum
  askContractOrDenom: ContractAddr | TokenDenomEnum
  offerTokenSymbol: string
  askTokenSymbol: string
  pairContract: ContractAddr
}): UseLimitOrderBuyReturn => {
  const { limitOrder, MINIONToken } = useNetwork()
  const { balance: uusdBal } = useMyBalance({
    contractOrDenom: TokenDenomEnum.uusd,
  })

  const { balance: offerDenomBal } = useMyBalance({
    contractOrDenom: offerDenom,
  })

  const { balance: miawBal } = useMyBalance({
    contractOrDenom: MINIONToken.contractOrDenom,
  })

  const { getSubmitOrderMsgs } = useFabricator()
  const connectedWallet = useConnectedWallet()

  const { poolInfo } = usePool({
    pairContract,
    token_0_ContractOrDenom: askContractOrDenom,
  })

  const askTokenPrice = UTIL.toBn(poolInfo?.token_0_Price)
    .dp(6)
    .toString(10) as Token

  const postTxResult = useRecoilValue(postTxStore.postTxResult)
  const { postTx } = usePostTx()

  const walletAddress = connectedWallet?.walletAddress as string

  const [askAmount, setAskAmount] = useState('' as Token)
  const askAmountErrMsg = useMemo(() => {
    return validateFormInputAmountDecimal({
      input: askAmount,
    })
  }, [askAmount])

  const [askPrice, setAskPrice] = useState('' as Token)
  const askPriceErrMsg = useMemo(() => {
    return validateFormInputAmount({
      input: askPrice,
      max: askTokenPrice,
    })
  }, [askPrice])

  const offerAmount = useMemo(() => {
    if (askAmount && askPrice) {
      return UTIL.toBn(askAmount)
        .multipliedBy(askPrice)
        .dp(6)
        .toString(10) as Token
    }
    return '0' as Token
  }, [askAmount, askPrice])
  const offerAmountErrMsg = useMemo(() => {
    const myOfferToken = UTIL.demicrofy(offerDenomBal)
    return validateFormInputAmount({
      input: offerAmount,
      max: myOfferToken,
    })
  }, [offerAmount])

  const myMiawAmount = UTIL.demicrofy(miawBal)
  const [MINIONAmount, setMINIONAmount] = useState<Token>('1' as Token)
  const MINIONAmountErrMsg = useMemo(() => {
    return validateFormInputAmount({
      input: MINIONAmount,
      max: myMiawAmount,
      min: '1' as Token,
    })
  }, [MINIONAmount, myMiawAmount])

  const invalidForm =
    postTxResult.status === PostTxStatus.BROADCAST ||
    askAmount.trim() === '' ||
    !!MINIONAmountErrMsg ||
    !!askAmountErrMsg ||
    !!askPriceErrMsg

  const txOptions: CreateTxOptions = useMemo(() => {
    let msgs: MsgExecuteContract[] = []
    if (Number(askAmount) > 0 && Number(offerAmount) > 0) {
      msgs = getSubmitOrderMsgs({
        offerAmount,
        askAmount,
        limitOrderContract: limitOrder,
        offerContractOrDenom: offerDenom,
        askContractOrDenom,
        feeContractOrDenom: MINIONToken.contractOrDenom,
        feeAmount: MINIONAmount,
      })
    }
    return {
      msgs,
      feeDenoms: ['uusd'],
    }
  }, [walletAddress, offerAmount, askAmount, MINIONAmount])

  const { fee } = useCalcFee({
    isValid: !invalidForm,
    txOptions,
  })

  const updateAskAmount = async (nextAskAmount: Token): Promise<void> => {
    setAskAmount(nextAskAmount.trim() as Token)
  }

  const updateAskPrice = async (nextAskPrice: Token): Promise<void> => {
    setAskPrice(nextAskPrice.trim() as Token)
  }

  const submitErrMsg = useMemo(() => {
    let msg = ''

    if (fee) {
      let availableUusd = UTIL.toBn(uusdBal)

      if (offerDenom === TokenDenomEnum.uusd) {
        availableUusd = availableUusd.minus(UTIL.microfy(askAmount))
      }

      msg = validateFee({
        availableUusd: availableUusd.toFixed(0) as uUST,
        fee,
      })
    }

    return msg
  }, [fee, askAmount])

  const onClickLimitOrderBuy = (): void => {
    postTx({ txOptions: { ...txOptions, fee } })
  }

  const initForm = (): void => {
    updateAskAmount('' as Token)
    setAskPrice('' as Token)
  }

  useEffect(() => {
    initForm()
  }, [pairContract])

  useEffect(() => {
    if (postTxResult.status === PostTxStatus.DONE) {
      initForm()
    }
  }, [postTxResult.status])

  return {
    askTokenPrice,
    offerDenom,
    askContractOrDenom,
    offerTokenSymbol,
    askTokenSymbol,

    offerAmount,
    offerAmountErrMsg,

    askAmount,
    updateAskAmount,
    askAmountErrMsg,

    askPrice,
    updateAskPrice,
    askPriceErrMsg,

    MINIONToken,
    MINIONAmount,
    setMINIONAmount,
    MINIONAmountErrMsg,

    fee,
    onClickLimitOrderBuy,
    invalidForm,
    submitErrMsg,
  }
}

export default useLimitOrderBuy

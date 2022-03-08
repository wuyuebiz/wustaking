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
  validateFormInputMinAmount,
} from 'logics/validator'
import useNetwork from '../useNetwork'

export type UseLimitOrderSellReturn = {
  offerContractOrDenom: ContractAddr | TokenDenomEnum
  askDenom: ContractAddr | TokenDenomEnum
  offerTokenSymbol: string
  askTokenSymbol: string

  offerAmount: Token

  askAmount: Token
  updateOfferAmount: (value: Token) => void
  offerAmountErrMsg: string
  askPrice: Token
  updateAskPrice: (value: Token) => void
  askPriceErrMsg: string

  wutToken: TokenType
  wutAmount: Token
  setWUTAmount: (value: Token) => void
  wutAmountErrMsg: string

  fee?: Fee

  onClickLimitOrderSell: () => void
  invalidForm: boolean
  submitErrMsg: string
}

const useLimitOrderSell = ({
  offerContractOrDenom,
  askDenom,
  offerTokenSymbol,
  askTokenSymbol,
  pairContract,
}: {
  offerContractOrDenom: ContractAddr | TokenDenomEnum
  askDenom: ContractAddr | TokenDenomEnum
  offerTokenSymbol: string
  askTokenSymbol: string
  pairContract: ContractAddr
}): UseLimitOrderSellReturn => {
  const { limitOrder, wutToken } = useNetwork()
  const { balance: uusdBal } = useMyBalance({
    contractOrDenom: TokenDenomEnum.uusd,
  })

  const { balance: offerDenomBal } = useMyBalance({
    contractOrDenom: offerContractOrDenom,
  })

  const { balance: miawBal } = useMyBalance({
    contractOrDenom: wutToken.contractOrDenom,
  })

  const { getSubmitOrderMsgs } = useFabricator()
  const connectedWallet = useConnectedWallet()

  const postTxResult = useRecoilValue(postTxStore.postTxResult)
  const { postTx } = usePostTx()

  const walletAddress = connectedWallet?.walletAddress as string

  const [offerAmount, setOfferAmount] = useState('' as Token)
  const offerAmountErrMsg = useMemo(() => {
    const myOfferAmount = UTIL.demicrofy(offerDenomBal)
    return validateFormInputAmount({
      input: offerAmount,
      max: myOfferAmount,
    })
  }, [offerAmount])

  const [askPrice, setAskPrice] = useState('' as Token)
  const askPriceErrMsg = useMemo(() => {
    return validateFormInputMinAmount({
      input: askPrice,
      min: '0.000001' as Token,
    })
  }, [askPrice])

  const askAmount = useMemo(() => {
    if (offerAmount && askPrice) {
      return UTIL.toBn(offerAmount)
        .multipliedBy(askPrice)
        .dp(6)
        .toString(10) as Token
    }
    return '0' as Token
  }, [offerAmount, askPrice])

  const myMiawAmount = UTIL.demicrofy(miawBal)
  const [wutAmount, setWUTAmount] = useState<Token>('1' as Token)
  const wutAmountErrMsg = useMemo(() => {
    return validateFormInputAmount({
      input: wutAmount,
      max: myMiawAmount,
      min: '1' as Token,
    })
  }, [wutAmount, myMiawAmount])

  const invalidForm =
    postTxResult.status === PostTxStatus.BROADCAST ||
    offerAmount.trim() === '' ||
    !!wutAmountErrMsg ||
    !!offerAmountErrMsg ||
    !!askPriceErrMsg

  const txOptions: CreateTxOptions = useMemo(() => {
    let msgs: MsgExecuteContract[] = []
    if (Number(askAmount) > 0 && Number(offerAmount) > 0) {
      msgs = getSubmitOrderMsgs({
        offerAmount,
        askAmount,
        limitOrderContract: limitOrder,
        offerContractOrDenom,
        askContractOrDenom: askDenom,
        feeContractOrDenom: wutToken.contractOrDenom,
        feeAmount: wutAmount,
      })
    }
    return {
      msgs,
      feeDenoms: ['uusd'],
    }
  }, [walletAddress, offerAmount, askAmount, wutAmount])

  const { fee } = useCalcFee({
    isValid: !invalidForm,
    txOptions,
  })

  const updateOfferAmount = async (nextOfferAmount: Token): Promise<void> => {
    setOfferAmount(nextOfferAmount.trim() as Token)
  }

  const updateAskPrice = async (nextAskPrice: Token): Promise<void> => {
    setAskPrice(nextAskPrice.trim() as Token)
  }

  const submitErrMsg = useMemo(() => {
    let msg = ''

    if (fee) {
      let availableUusd = UTIL.toBn(uusdBal)

      if (offerContractOrDenom === TokenDenomEnum.uusd) {
        availableUusd = availableUusd.minus(UTIL.microfy(askAmount))
      }

      msg = validateFee({
        availableUusd: availableUusd.toFixed(0) as uUST,
        fee,
      })
    }

    return msg
  }, [fee, askAmount])

  const onClickLimitOrderSell = (): void => {
    postTx({ txOptions: { ...txOptions, fee } })
  }

  const initForm = (): void => {
    updateOfferAmount('' as Token)
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
    offerContractOrDenom,
    askDenom,
    offerTokenSymbol,
    askTokenSymbol,

    askAmount,

    offerAmount,
    updateOfferAmount,
    offerAmountErrMsg,

    askPrice,
    updateAskPrice,
    askPriceErrMsg,

    wutToken,
    wutAmount,
    setWUTAmount,
    wutAmountErrMsg,

    fee,
    onClickLimitOrderSell,
    invalidForm,
    submitErrMsg,
  }
}

export default useLimitOrderSell

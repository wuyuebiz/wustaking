import { CreateTxOptions, Fee } from '@terra-money/terra.js'
import {
  TxResult,
  useConnectedWallet,
  useWallet,
} from '@terra-money/wallet-provider'

import useLCD from 'hooks/query/useLCD'
import { PostTxStatus } from 'types'
import { useSetRecoilState } from 'recoil'
import postTxStore from 'store/postTxStore'

export type UsePostTxReturn = {
  getFee: (props: { txOptions: CreateTxOptions }) => Promise<Fee | undefined>
  postTx: (props: { txOptions: CreateTxOptions }) => Promise<void>
  resetPostTx: () => void
}

const usePostTx = (): UsePostTxReturn => {
  const wallet = useWallet()

  const connectedWallet = useConnectedWallet()
  const { lcd } = useLCD()

  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const getFee = async ({
    txOptions,
  }: {
    txOptions: CreateTxOptions
  }): Promise<Fee | undefined> => {
    if (connectedWallet && txOptions.msgs.length > 0) {
      const createdTx = await lcd.tx.create(
        [{ address: connectedWallet.walletAddress }],
        txOptions
      )

      return createdTx.auth_info.fee
    }
  }

  const postTx = async ({
    txOptions,
  }: {
    txOptions: CreateTxOptions
  }): Promise<void> => {
    try {
      resetPostTx()
      setPostTxResult({ status: PostTxStatus.POST })
      const txResult: TxResult = await wallet.post(txOptions)
      setPostTxResult({ status: PostTxStatus.BROADCAST, value: txResult })
    } catch (error) {
      setPostTxResult({ status: PostTxStatus.ERROR, error })
    }
  }

  const resetPostTx = (): void => {
    setPostTxResult({ status: PostTxStatus.READY })
  }

  return {
    getFee,
    postTx,
    resetPostTx,
  }
}

export default usePostTx

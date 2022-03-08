import { useConnectedWallet } from '@terra-money/wallet-provider'
import useAddressName, {
  UseAddressNameReturn,
} from 'hooks/query/wutToken/useAddressName' //

const useMyName = (): UseAddressNameReturn => {
  const connectedWallet = useConnectedWallet()
  const walletAddress = connectedWallet?.walletAddress as string

  const addressNameReturn = useAddressName({ walletAddress })

  return addressNameReturn
}

export default useMyName

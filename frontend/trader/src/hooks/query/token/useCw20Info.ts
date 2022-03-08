import useLCD from '../useLCD'
import { QueryKeyEnum, cw20, ContractAddr } from 'types'
import useReactQuery from 'hooks/common/useReactQuery'

export type UseTokenInfoReturn = {
  tokenInfo?: cw20.TokenInfoResponse
  refetch: () => void
}

const useCw20Info = ({
  token,
}: {
  token: ContractAddr
}): UseTokenInfoReturn => {
  const { wasmFetch } = useLCD()
  const { data: tokenInfo, refetch } = useReactQuery(
    [QueryKeyEnum.TOKEN_INFO, token],
    () =>
      token &&
      wasmFetch<cw20.TokenInfo, cw20.TokenInfoResponse>({
        contract: token,
        msg: { token_info: {} },
      }),

    {
      enabled: !!token,
    }
  )

  return { tokenInfo, refetch }
}

export default useCw20Info

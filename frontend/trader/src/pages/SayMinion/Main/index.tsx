import { ReactElement, useEffect } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import { STYLE } from 'consts'

import { View, FormText } from 'components'
import useSayMinion from 'hooks/common/sayMinion/useSayMinion'
import useNetwork from 'hooks/common/useNetwork'

import postTxStore from 'store/postTxStore'

import { PostTxStatus, TokenType } from 'types'

import TopInfo from './TopInfo'
import InputMemo from './InputMemo'
import MemoList from './MemoList'

const StyledContainer = styled(View)`
  ${STYLE.setMediaWidth('lg')}
`

const StyledContentsLayout = styled(View)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  column-gap: 20px;
  padding: 30px 20px;

  @media ${STYLE.media.tablet} {
    grid-template-columns: 1fr;
  }
`

const Contents = ({ MINIONToken }: { MINIONToken: TokenType }): ReactElement => {
  const postTxResult = useRecoilValue(postTxStore.postTxResult)
  const sayMINIONReturn = useSayMinion({ MINIONToken })
  const { burnReturn } = sayMINIONReturn

  useEffect(() => {
    if (postTxResult.status === PostTxStatus.DONE) {
      setTimeout(() => {
        burnReturn.setMemo('')
      }, 500)
    }
  }, [postTxResult.status])

  return (
    <StyledContainer>
      <StyledContentsLayout>
        <FormText fontType="B24">MINION Board</FormText>
        <View style={{ flex: 1 }}>
          <TopInfo MINIONToken={MINIONToken} />
          <InputMemo sayMiawReturn={sayMINIONReturn} />
          <MemoList />
        </View>
      </StyledContentsLayout>
    </StyledContainer>
  )
}

const Main = (): ReactElement => {
  const { MINIONToken } = useNetwork()
  return MINIONToken ? (
    <Contents MINIONToken={MINIONToken} />
  ) : (
    <StyledContainer>
      <FormText fontType="B32">{`MINION token is not ready ${STYLE.CAT_EMOJI}`}</FormText>
    </StyledContainer>
  )
}
export default Main

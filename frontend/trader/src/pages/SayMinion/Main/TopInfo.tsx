import { ReactElement } from 'react'
import styled from 'styled-components'

import { COLOR, STYLE, UTIL } from 'consts'

import { View, FormText, Row } from 'components'
import useSayMinion from 'hooks/common/sayMinion/useSayMinion'

import { TokenType } from 'types'
import useMyBalance from 'hooks/common/useMyBalance'

const StyledContainer = styled(View)`
  background-color: ${COLOR.primary._600};
  padding: 10px;
  border-radius: 8px;
`

const StyledTotalBurnedBox = styled(Row)`
  padding-bottom: 15px;
  @media ${STYLE.media.mobile} {
    flex-direction: column;
  }
`

const TopInfo = ({ MINIONToken }: { MINIONToken: TokenType }): ReactElement => {
  const sayMINIONReturn = useSayMinion({ MINIONToken })

  const { balance: myMINION } = useMyBalance({
    contractOrDenom: MINIONToken.contractOrDenom,
  })

  return (
    <StyledContainer>
      <StyledTotalBurnedBox>
        <FormText
          fontType="R18"
          style={{ paddingRight: 5 }}
          color={COLOR.rainbow.red}
        >
          🔥 Total Burned :
        </FormText>
        <FormText fontType="B18" color={COLOR.gray._100}>{`${UTIL.formatAmount(
          sayMINIONReturn.burnedAmount
        )} MINION ( ≒  ${UTIL.formatAmount(sayMINIONReturn.burnedPrice, {
          toFix: 0,
        })} UST )`}</FormText>
      </StyledTotalBurnedBox>
      <View>
        <FormText
          fontType="R16"
          color={COLOR.gray._100}
        >{`My MINION : ${UTIL.formatAmount(myMINION)}`}</FormText>
      </View>
    </StyledContainer>
  )
}

export default TopInfo

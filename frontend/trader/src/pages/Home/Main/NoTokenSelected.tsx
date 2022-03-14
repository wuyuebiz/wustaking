import { ReactElement } from 'react'
import styled from 'styled-components'
import MINI_ANI from 'images/minion_cute.gif'
import { View, FormText, Card } from 'components'

const StyledContainer = styled(Card)`
  align-items: center;
  margin-bottom: 20px;
`
const NoTokenSelected = (): ReactElement => {
  return (
    <StyledContainer>
      <View style={{ width: 300 }}>
        <img src={MINI_ANI} alt=''/>
      </View>
      <FormText fontType="B16">Select a token to trade or provide</FormText>
    </StyledContainer>
  )
}

export default NoTokenSelected

import { ReactElement } from 'react'
import styled from 'styled-components'

import { STYLE } from 'consts'

import { View, FormText } from 'components'

import useNetwork from 'hooks/common/useNetwork'

import Send from './Send'

const StyledContainer = styled(View)`
  ${STYLE.setMediaWidth('sm')}
  @media ${STYLE.media.tablet} {
    padding: 0 20px;
  }
`

const Main = (): ReactElement => {
  const { wutToken } = useNetwork()

  return (
    <StyledContainer>
      {wutToken ? (
        <Send token={wutToken} />
      ) : (
        <FormText fontType="B32">WUT token is not ready</FormText>
      )}
    </StyledContainer>
  )
}

export default Main

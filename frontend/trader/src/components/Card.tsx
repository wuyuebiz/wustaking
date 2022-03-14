import styled from 'styled-components'

import { COLOR } from 'consts'
import View from './View'

const Card = styled(View)`
  padding: 16px;
  border: 0 solid transparent;
  border-radius: .286rem;
  box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
  background-color: ${COLOR.white};
`

export default Card

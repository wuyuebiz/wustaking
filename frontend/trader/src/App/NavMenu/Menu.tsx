import { ReactElement } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { useLocation } from 'react-router-dom'

import logo from 'images/minion.png'

import { COLOR, STYLE } from 'consts'

import { FormText, Row, FormImage } from 'components'

import { RoutePath } from 'types'
import useRoute from 'hooks/common/useRoute'

const StyledContainer = styled(Row)`
  align-items: center;
  margin-left: 20px;
`

const StyledBrand = styled(Row)`
  ${STYLE.clickable};
  align-items: center;
`

const StyledMenu = styled(Row)`
  padding-left: 10px;
`
const StyledMenuItem = styled(Row)`
  ${STYLE.clickable};
  align-items: center;
  margin-right: 32px;
  text-transform: uppercase;

  @media ${STYLE.media.tablet} {
    padding-right: 0;
    padding: 20px 0;
    justify-content: space-between;
  }
`

const Menu = (): ReactElement => {
  const { push } = useRoute()
  const location = useLocation()
  const { pathname } = location

  let menuList = [
    {
      to: RoutePath.lpTower,
      title: 'Lp Tower',
    },
    {
      to: RoutePath.say_minion,
      title: 'Say Minion',
    },
    {
      to: RoutePath.send,
      title: 'Send',
    },
    {
      to: RoutePath.minion_paper,
      title: 'Minion Paper',
    },
  ]

  return (
    <StyledContainer>
      <StyledBrand onClick={(): void => push(RoutePath.home)}>
        <FormImage src={logo} size={30} />
        <FormText
          style={{ marginLeft: 20, marginRight: 20 }}
          fontType={{ default: 'B24', mobile: 'B20' }}
          color={COLOR.primary._400}
        >
          Minion Trader
        </FormText>
      </StyledBrand>

      <StyledMenu>
        {_.map(menuList, (menu, index) => {
          const isActive = menu.to.includes(pathname.split('/')[1])

          return (
            <StyledMenuItem
              key={`menuList-${index}`}
              onClick={(): void => {
                push(menu.to)
              }}
            >
              <FormText
                fontType="B16"
                style={{
                  borderBottom: isActive
                    ? `1px solid ${COLOR.primary._600}`
                    : '1px solid #eeeeee00',
                }}
              >
                {menu.title}
              </FormText>
            </StyledMenuItem>
          )
        })}
      </StyledMenu>
    </StyledContainer>
  )
}

export default Menu

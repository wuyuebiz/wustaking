import { ReactElement } from 'react'
import styled from 'styled-components'
import QrCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'

import { STYLE, WHITELIST, COLOR } from 'consts'

import { View, Card, FormText, LinkA } from 'components'
import { IconSquare, IconSquareCheck, IconSquarePlus } from '@tabler/icons'

const StyledContainer = styled(View)`
  ${STYLE.setMediaWidth()}
  @media ${STYLE.media.tablet} {
    padding: 0 20px;
  }
`

const StyledCard = styled(Card)`
  background-size: cover;
`

const StyledSection = styled(View)`
  margin-bottom: 20px;
`

const StyledMainTitle = styled(FormText)``

const StyledSubTitle = styled(FormText)``
const StyledDesc = styled(FormText)`
  flex-direction: row;
  align-items: center;
  white-space: pre-wrap;
  word-break: break-all;
  background-color: ${COLOR.white};
  width: fit-content;
  padding: 0 5px;
`

const Main = (): ReactElement => {
  return (
    <StyledContainer>
      <StyledMainTitle fontType="B32">Minion paper</StyledMainTitle>
      <StyledCard>
        <StyledSection>
          <StyledSubTitle fontType="B24">What the Minion</StyledSubTitle>
          <StyledDesc>
            <LinkA link="https://github.com/wuyuebiz/wustaking">
              <FormText fontType={'R18'} color={COLOR.primary._400}>
                - Open source project
              </FormText>
            </LinkA>
          </StyledDesc>
          <StyledDesc>
            - Token,Lp,Pair contracts are based on The Terraswap factory
          </StyledDesc>
          <StyledDesc>- Minion was made by a dev who loves the Terra</StyledDesc>
        </StyledSection>

        <StyledSection>
          <StyledSubTitle fontType="B24">
            Token Distribution plan for Minion V1
          </StyledSubTitle>
          <StyledDesc fontType="B20">100M Total supply</StyledDesc>
          <StyledDesc>
            {'- 15% LP Staking reward. 5years, 5M>4M>3M>2M>1M'}
          </StyledDesc>
          <StyledDesc>{'- 11% Community funds'}</StyledDesc>
          <StyledDesc>{'- 4% Lp Supply'}</StyledDesc>
          <StyledDesc>{'- 1% Team'}</StyledDesc>
          <StyledDesc>{'- 70% burned'}</StyledDesc>
        </StyledSection>

        <StyledSection>
          <StyledSubTitle fontType="B24">Roadmap for Minion V1</StyledSubTitle>
          <StyledDesc>
            <IconSquareCheck color={COLOR.primary._600} /> SayMinion
          </StyledDesc>
          <StyledDesc>
            <IconSquareCheck color={COLOR.primary._600} /> LpTower
          </StyledDesc>
          <StyledDesc>
            <IconSquareCheck color={COLOR.primary._600} /> LpStaking
          </StyledDesc>
          <StyledDesc>
            <IconSquareCheck color={COLOR.primary._600} /> Impermanent gain/loss
            chart
          </StyledDesc>
          <StyledDesc>
            <IconSquarePlus color={COLOR.success} /> Miawaifu NFT
          </StyledDesc>
          <StyledDesc>
            <IconSquarePlus color={COLOR.success} /> NFT Trader
          </StyledDesc>
          <StyledDesc>
            <IconSquare color={COLOR.gray._900} /> Any interesting ideas
          </StyledDesc>
        </StyledSection>

        <StyledSection>
          <StyledSubTitle fontType="B24">Keeping token prices</StyledSubTitle>
          <StyledDesc fontType="B18">1. SayMinion</StyledDesc>
          <StyledDesc>
            {'-> Burn MINION through SayMINION with various events'}
          </StyledDesc>
          <StyledDesc fontType="B18">2. Miawaifu NFT</StyledDesc>
          <StyledDesc>{'-> Supply lp with Miawaifu sales proceeds'}</StyledDesc>
          <StyledDesc fontType="B18">3. NFT Trader</StyledDesc>
          <StyledDesc>{'-> Burn MINION to upload nft'}</StyledDesc>
          <StyledDesc>{'-> Supply lp with nft trading fee'}</StyledDesc>
        </StyledSection>

        <StyledSection>
          <StyledSubTitle fontType="B24">Minion V2?</StyledSubTitle>
          <StyledDesc>
            - Supporting token swap independently without the Terraswap
          </StyledDesc>
          <StyledDesc>- who knows?</StyledDesc>
        </StyledSection>

        <StyledSection>
          <StyledSubTitle fontType="B24">Need support?</StyledSubTitle>
          <StyledDesc>
            <LinkA link="https://discord.gg/QuNNPHHV">
              <FormText fontType={'R18'} color={COLOR.primary._400}>
                - Discord
              </FormText>
            </LinkA>
          </StyledDesc>
          <StyledDesc>
            <LinkA link="https://github.com/wuyuebiz/wustaking/issues">
              <FormText fontType={'R18'} color={COLOR.primary._400}>
                - Github issues
              </FormText>
            </LinkA>
          </StyledDesc>
        </StyledSection>

        <StyledSection>
          <StyledSubTitle fontType="B24">Support Developer</StyledSubTitle>

          <CopyToClipboard
            text={WHITELIST.address.MINIONDeveloper}
            onCopy={(): void => {
              toast(`Copied address!`, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              })
            }}
          >
            <StyledDesc color={COLOR.primary._400}>
              {`- ${WHITELIST.address.MINIONDeveloper}`}
            </StyledDesc>
          </CopyToClipboard>
          <br />
          <QrCode value={WHITELIST.address.MINIONDeveloper} size={200} />
        </StyledSection>
      </StyledCard>
    </StyledContainer>
  )
}

export default Main

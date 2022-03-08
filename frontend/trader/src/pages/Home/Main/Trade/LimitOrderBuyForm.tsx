import { ReactElement, useMemo } from 'react'
import styled from 'styled-components'

import { ASSET, UTIL, COLOR } from 'consts'

import {
  View,
  Row,
  FormInput,
  BalanceFormat,
  MaxButton,
  FormDataList,
  Hr,
  FormText,
  FormLabel,
} from 'components'
import { TokenDenomEnum, uToken, Token } from 'types'
import { UseLimitOrderBuyReturn } from 'hooks/common/trade/useLimitOrderBuy'
import useMyBalance from 'hooks/common/useMyBalance'

const StyledSection = styled(View)`
  padding-bottom: 20px;
`

const StyledMaxBalance = styled(Row)`
  justify-content: flex-end;
  padding-top: 8px;
`

const LimitOrderBuyForm = ({
  useLimitOrderBuyReturn,
}: {
  useLimitOrderBuyReturn: UseLimitOrderBuyReturn
}): ReactElement => {
  const {
    askTokenPrice,
    offerTokenSymbol,
    askTokenSymbol,

    offerAmount,
    offerAmountErrMsg,

    askAmount,
    updateAskAmount,
    askAmountErrMsg,

    askPrice,
    updateAskPrice,
    askPriceErrMsg,

    wutToken,
    wutAmount,
    setWUTAmount,
    wutAmountErrMsg,

    fee,
  } = useLimitOrderBuyReturn

  const { balance: miawBal } = useMyBalance({
    contractOrDenom: wutToken.contractOrDenom,
  })

  const feeData = useMemo(
    () =>
      fee
        ? fee.amount.map((f) => ({
            title: 'Tx Fee',
            value: (
              <BalanceFormat
                value={f.amount.toString() as uToken}
                suffix={ASSET.symbolOfDenom[f.denom as TokenDenomEnum]}
              />
            ),
          }))
        : [],
    [fee]
  )

  return (
    <>
      <StyledSection>
        <View style={{ paddingBottom: 20 }}>
          <FormLabel>Order to buy</FormLabel>
          <FormInput
            number
            suffix={askTokenSymbol}
            onChangeValue={(value): void => {
              updateAskAmount(value as Token)
            }}
            inputProps={{
              placeholder: '0',
              value: askAmount,
            }}
            isError={!!askAmountErrMsg}
            helperText={askAmountErrMsg}
          />
        </View>
        <View>
          <FormLabel>Price</FormLabel>
          <FormInput
            number
            suffix={offerTokenSymbol}
            onChangeValue={(value): void => {
              updateAskPrice(value as Token)
            }}
            inputProps={{
              placeholder: '0',
              value: askPrice,
            }}
            isError={!!askPriceErrMsg}
            helperText={askPriceErrMsg}
          />
          <StyledMaxBalance>
            <MaxButton
              value={UTIL.microfy(askTokenPrice)}
              onClick={(value): void => {
                updateAskPrice(UTIL.demicrofy(value) as Token)
              }}
            />
          </StyledMaxBalance>
        </View>
        <View>
          <FormLabel>Fee for priority</FormLabel>
          <FormInput
            number
            suffix={wutToken.symbol}
            onChangeValue={(value): void => {
              setWUTAmount(value as Token)
            }}
            inputProps={{
              placeholder: '0',
              value: wutAmount,
            }}
            isError={!!wutAmountErrMsg}
            helperText={wutAmountErrMsg}
          />
          <StyledMaxBalance>
            <MaxButton
              value={miawBal}
              onClick={(value): void => {
                setWUTAmount(UTIL.demicrofy(value) as Token)
              }}
            />
          </StyledMaxBalance>
        </View>
        <View>
          <FormText>
            {`${UTIL.formatAmount(
              UTIL.microfy(offerAmount)
            )} ${offerTokenSymbol}`}
          </FormText>
          {offerAmountErrMsg && (
            <FormText fontType={'R14'} color={COLOR.error}>
              {offerAmountErrMsg}
            </FormText>
          )}
        </View>
      </StyledSection>

      <StyledSection>
        <Hr type="dashed" />
      </StyledSection>

      {fee && (
        <StyledSection>
          <FormDataList data={feeData} />
        </StyledSection>
      )}
    </>
  )
}

export default LimitOrderBuyForm

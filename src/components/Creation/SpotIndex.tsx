import { AutoRow, RowBetween } from 'components/Row'
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { HideSmall, ShowSmall, TYPE } from 'theme'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TextValueInput } from 'components/TextInput'
import { ButtonPrimary as ButtonPrimaryDesktop, ButtonDropdown, ButtonOutlinedPrimary } from 'components/Button'
import NumericalInput from 'components/NumericalInput'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import { SpotConfirmation } from './Confirmation'
import { AssetsParameter, CreateSpotData } from './index'
import { CurrencyNFTInputPanel } from 'components/CurrencyInputPanel'
// import { Currency } from '@uniswap/sdk'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useAssetsTokens } from 'hooks/useIndexDetail'
import CurrencyLogo from 'components/CurrencyLogo'
import { Currency, Token } from '@uniswap/sdk'
import { useCurrentUserInfo } from 'state/userInfo/hooks'
import { X } from 'react-feather'
import { useNFTETHPrice } from 'data/Reserves'
import { TokenAmount } from '@uniswap/sdk'
import { useCheckSpotCreateButton } from 'hooks/useIndexCreateCallback'
import { TokenInfo } from '@uniswap/token-lists'
import useBreakpoint from 'hooks/useBreakpoint'
import { useActiveWeb3React } from 'hooks'
import { ZERO_ADDRESS } from 'constants/index'

export const StyledCurrencyInputPanel = styled.div<{ lessTwo: boolean }>`
  padding-right: ${({ lessTwo }) => (lessTwo ? '0' : '40px')};
  position: relative;
  .del-input {
    display: ${({ lessTwo }) => (lessTwo ? 'none' : 'black')};
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    top: unset;
    right:40px;
    bottom:0px;
    z-index:1;
    color:${theme.text3}
  `};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding-right:0; 
  `};
`

export const IndexIcon = styled.div<{ current?: boolean }>`
  border: 1px solid;
  border-color: ${({ current }) => (current ? 'black' : 'rgba(0, 0, 0, 0.2)')};
  width: 32px;
  height: 32px;
  font-weight: 500;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  text-transform: capitalize;
  border-radius: 50%;
  margin-left: 10px;
  flex-shrink: 0;
  color: ${({ current }) => (current ? 'black' : 'rgba(0, 0, 0, 0.2)')};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 28px;
    height: 28px;
    line-height: 28px;
  `}
`
export const InputRow = styled.div<{ disabled?: boolean }>`
  align-items: center;
  border-radius: 14px;
  position: relative;
  ${({ theme }) => theme.flexRowNoWrap}
`

export const CustomNumericalInput = styled(NumericalInput)`
  background: transparent;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px 150px 20px 20px;
  width: 280px;
  height: 60px;
  color: ${({ theme }) => theme.black};
`
export const StyledBalanceMax = styled.button`
  position: absolute;
  right: 20px;
  top: 10px;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 49px;
  font-size: 0.875rem;
  padding: 0 1rem;
  width: 120px;
  background: rgba(0, 0, 0, 0.1);
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.black};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

export const TokenButtonDropdown = styled(ButtonDropdown)`
  background: linear-gradient(0deg, #ffffff, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-weight: normal;
  width: 208px;
  height: 60px;
`
const StyledCard = styled.div`
  transform-origin: 0 0;
  transform: scale(0.715);
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  transform: unset;
  `}
`

const BackgroundItem = styled.div<{ selected?: boolean; color: CardColor }>`
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid ${({ selected }) => (selected ? '#000000' : 'rgba(0, 0, 0, 0.1)')};
  width: 76px;
  height: 76px;
  background: ${({ theme, color }) => theme[color]};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 56px;
  height: 56px;`}
`
const CreationTitleBox = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: ${({ theme }) => theme.bg1};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  background-color: ${({ theme }) => theme.bg2};
  `}
`

const ButtonPrimary = styled(ButtonPrimaryDesktop)`
  margin-top: 40px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top: auto;
  background-color: ${({ theme }) => theme.primary1};
  color: #ffffff;
  :hover{
    background: ${({ theme }) => theme.primary3};
  };
  :active{
    background: ${({ theme }) => theme.primary4};
  }
  :disabled{
    background: ${({ theme }) => theme.primary5};
  }
  `}
`

const CardPanelWrapper = styled(AutoRow)`
  align-items: flex-start;
  > div:first-child {
    width: 264px;
  }
  > div:last-child {
    width: 200px;
    height: 300px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: center;
    > div:first-child, > div:last-child{
      width: 100%;
      height: auto;
    }
  `}
`

const ButtonGroup = styled(AutoColumn)`
  margin-top: 40px;
  > button:last-child {
    margin-top: 0;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: auto;
  `}
`

export default function SpotIndex({
  current,
  setCurrent,
  data,
  setData,
  onConfirm
}: {
  current: number
  setCurrent: Dispatch<SetStateAction<number>>
  data: CreateSpotData
  setData: (key: string, value: AssetsParameter[] | CardColor | string) => void
  onConfirm: () => void
}) {
  const [assetParams, setAssetParams] = useState<AssetsParameter[]>(data.assetsParameters)
  const userInfo = useCurrentUserInfo()
  const isDownSm = useBreakpoint('sm')
  const { account } = useActiveWeb3React()

  const handleParameterInput = useCallback(
    (index: number, value: AssetsParameter) => {
      if (!assetParams[index]) return
      const retParam = assetParams.map((item, idx) => {
        if (idx === index) {
          return value
        }
        return item
      })

      setAssetParams(retParam)
    },
    [setAssetParams, assetParams]
  )

  const addAsset = useCallback(() => {
    if (assetParams.length >= 8) return
    setAssetParams([...assetParams, { amount: '', currency: '' }])
  }, [assetParams, setAssetParams])

  const delAssetsItem = useCallback(
    index => {
      if (assetParams.length < 3) return
      const _assetParams = assetParams.filter((item, idx) => {
        return item && idx !== index
      })
      setAssetParams(_assetParams)
    },
    [assetParams, setAssetParams]
  )

  const assetsBtnDIsabled = useMemo(() => {
    return (
      assetParams.filter(val => {
        return val.amount.trim() && val.currency.trim()
      }).length < 2
    )
  }, [assetParams])

  const toColorStep = useCallback(() => {
    const _assetParams = assetParams
      .filter(val => {
        return val.amount.trim() && val.amount.trim()
      })
      .map(v => {
        return {
          currency: v.currency,
          currencyToken: v.currencyToken,
          amount: v.amount
        }
      })
    if (_assetParams.length < 2) return
    setData('assetsParameters', _assetParams)
    setCurrent(++current)
    const contentBox = document.getElementById('create_content_box')
    if (contentBox) {
      contentBox.scrollTop = 0
    }
  }, [current, setCurrent, assetParams, setData])

  const selectTokens = useAssetsTokens(data.assetsParameters)

  const currentCard = useMemo((): NFTCardProps => {
    const _icons = selectTokens.map((val, idx) => {
      return <CurrencyLogo currency={val.currencyToken} key={idx} />
    })
    return {
      id: '',
      name: data.name,
      indexId: data.creatorId,
      color: data.color,
      address: account ?? ZERO_ADDRESS,
      icons: _icons,
      creator: userInfo ? userInfo.username : ''
    }
  }, [account, data.color, data.creatorId, data.name, selectTokens, userInfo])

  const handleGenerate = useCallback(() => {
    setData('color', currentCard.color)
    setCurrent(++current)
    const contentBox = document.getElementById('create_content_box')
    if (contentBox) {
      contentBox.scrollTop = 0
    }
  }, [current, setCurrent, setData, currentCard])

  const disabledCurrencys = useMemo(
    () => assetParams.map(({ currencyToken }) => currencyToken as Currency).filter(item => item),
    [assetParams]
  )

  const { eths } = useNFTETHPrice(data.assetsParameters)
  const tokenFluiditys: (TokenAmount | null)[] = useMemo(() => {
    return eths.map(val => val[3])
  }, [eths])

  const spotCreateButton = useCheckSpotCreateButton(tokenFluiditys)

  return (
    <>
      {current === 1 && (
        <>
          <AutoColumn gap="40px">
            <CreationHeader current={current}>Index Content</CreationHeader>
            <AutoColumn
              gap="40px"
              style={isDownSm ? { background: '#ffffff', padding: '24px 20px', borderRadius: '8px' } : undefined}
            >
              <TextValueInput
                value={data.name}
                onUserInput={val => {
                  setData('name', val)
                }}
                borderColor={isDownSm ? 'rgba(37, 37, 37, 0.1)' : undefined}
                backgroundColor={isDownSm ? '#ffffff' : undefined}
                maxLength={20}
                label="Index Name"
                placeholder="Please enter the name of your index"
                hint="Maximum 20 characters"
              />

              <TextValueInput
                textarea
                value={data.description}
                onUserInput={val => {
                  setData('description', val)
                }}
                borderColor={isDownSm ? 'rgba(37, 37, 37, 0.1)' : undefined}
                backgroundColor={isDownSm ? '#ffffff' : undefined}
                maxLength={100}
                label="Description"
                placeholder="Please explain why this index is meaningful"
                hint="Maximum 100 characters"
              />
            </AutoColumn>
            <ButtonPrimary
              height={60}
              onClick={() => {
                setCurrent(++current)
                const contentBox = document.getElementById('create_content_box')
                if (contentBox) {
                  contentBox.scrollTop = 0
                }
              }}
              disabled={!data.description.trim() || !data.name.trim()}
            >
              Next Step
            </ButtonPrimary>
          </AutoColumn>
        </>
      )}

      {current === 2 && (
        <>
          <AutoColumn gap="40px">
            <CreationHeader current={current}>Index Parameter</CreationHeader>
            <AutoColumn gap="10px">
              <RowBetween>
                <HideSmall>
                  <TYPE.black fontSize={14} fontWeight={500}>
                    Underlying asset
                  </TYPE.black>
                </HideSmall>
                <ShowSmall>
                  <TYPE.body fontSize={14} fontWeight={500}>
                    Underlying asset
                  </TYPE.body>
                </ShowSmall>
                <TYPE.darkGray fontSize={14} fontWeight={400}>
                  Maximum 8 assets
                </TYPE.darkGray>
              </RowBetween>
              <AutoColumn gap="8px">
                {assetParams.map((item: AssetsParameter, index: number) => {
                  return (
                    <StyledCurrencyInputPanel key={index} lessTwo={!!(assetParams.length < 3)}>
                      <CurrencyNFTInputPanel
                        hiddenLabel={true}
                        value={item.amount}
                        onUserInput={val => {
                          const newData = { ...item, amount: val }
                          handleParameterInput(index, newData)
                        }}
                        disabledCurrencys={disabledCurrencys}
                        // onMax={handleMax}
                        currency={item.currencyToken}
                        // pair={dummyPair}
                        showMaxButton={false}
                        onCurrencySelect={currency => {
                          if (currency instanceof WrappedTokenInfo) {
                            const newData = { ...item, currency: currency.address, currencyToken: currency }
                            handleParameterInput(index, newData)
                          } else if (currency instanceof Token) {
                            const tokenInfo: TokenInfo = {
                              chainId: currency.chainId,
                              address: currency.address,
                              name: currency.name ?? '',
                              decimals: currency.decimals,
                              symbol: currency.symbol ?? ''
                            }
                            const _currency = new WrappedTokenInfo(tokenInfo, [])
                            const newData = { ...item, currency: currency.address, currencyToken: _currency }
                            handleParameterInput(index, newData)
                          }
                        }}
                        label="Amount"
                        disableCurrencySelect={false}
                        id="stake-liquidity-token"
                        hideSelect={false}
                      />
                      <X
                        className="del-input"
                        onClick={() => {
                          delAssetsItem(index)
                        }}
                      />
                    </StyledCurrencyInputPanel>
                  )
                })}{' '}
              </AutoColumn>
            </AutoColumn>
            <ButtonGroup gap="12px">
              <ButtonOutlinedPrimary height={60} onClick={addAsset} disabled={assetParams.length === 8}>
                + Add asset
              </ButtonOutlinedPrimary>
              <ButtonPrimary height={60} onClick={toColorStep} disabled={assetsBtnDIsabled} marginTop={20}>
                Next Step
              </ButtonPrimary>
            </ButtonGroup>
          </AutoColumn>
        </>
      )}

      {current === 3 && (
        <>
          <AutoColumn gap="40px">
            <CreationHeader current={current}>NFT Cover Background</CreationHeader>
            <NFTCardPanel
              cardData={currentCard}
              setCardColor={(color: CardColor) => {
                setData('color', color)
              }}
            />
            <ButtonPrimary height={60} onClick={handleGenerate}>
              Generate
            </ButtonPrimary>
          </AutoColumn>
        </>
      )}

      {current === 4 && (
        <SpotConfirmation dataInfo={data} tokenFluiditys={tokenFluiditys}>
          <ButtonPrimary onClick={onConfirm} style={{ marginTop: 0 }} disabled={spotCreateButton.disabled} height={60}>
            {spotCreateButton.text}
          </ButtonPrimary>
        </SpotConfirmation>
      )}
    </>
  )
}

export function NFTCardPanel({
  cardData,
  setCardColor
}: {
  cardData: NFTCardProps
  setCardColor: (color: CardColor) => void
}) {
  return (
    <CardPanelWrapper justify="space-between">
      <AutoColumn gap="12px">
        <HideSmall>
          <TYPE.black fontSize={14}>Select background color</TYPE.black>
        </HideSmall>
        <ShowSmall>
          <TYPE.darkGray fontSize={14}>Select backgroud color</TYPE.darkGray>
        </ShowSmall>
        <AutoRow gap="6px">
          {Object.values(CardColor).map(color => (
            <BackgroundItem
              key={color}
              selected={cardData.color === color}
              color={color}
              onClick={() => setCardColor(color)}
            />
          ))}
        </AutoRow>
      </AutoColumn>
      <AutoColumn gap="12px">
        <HideSmall>
          <TYPE.black fontSize={14} style={{ maxWidth: 100 }}>
            Preview
          </TYPE.black>
        </HideSmall>
        <ShowSmall>
          <TYPE.darkGray fontSize={14} style={{ maxWidth: 100, marginTop: 24 }}>
            Preview
          </TYPE.darkGray>
        </ShowSmall>
        <StyledCard>
          <NFTCard createName="Locker ID" noBorderArea={true} {...cardData} />
        </StyledCard>
      </AutoColumn>
    </CardPanelWrapper>
  )
}

export function CreationHeader({
  title = 'Spot Index',
  current,
  children,
  indexArr = [1, 2, 3]
}: {
  title?: string
  current?: number
  children: React.ReactNode
  indexArr?: number[]
}) {
  return (
    <CreationTitleBox>
      <TYPE.smallGray fontSize="12px">{title}</TYPE.smallGray>
      <RowBetween>
        <TYPE.mediumHeader fontSize="30px">{children}</TYPE.mediumHeader>
        <div style={{ display: 'flex' }}>
          <IndexIconGroup indexArr={indexArr} current={current} />
        </div>
      </RowBetween>
    </CreationTitleBox>
  )
}

function IndexIconGroup({ current, indexArr = [1, 2, 3] }: { current?: number; indexArr?: number[] }) {
  return (
    <>
      {indexArr.map(v => (
        <IndexIcon current={current === v} key={v}>
          {v}
        </IndexIcon>
      ))}
    </>
  )
}

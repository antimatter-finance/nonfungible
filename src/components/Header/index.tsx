import { ChainId, TokenAmount } from '@uniswap/sdk'
import React, { useCallback, useState } from 'react'
import { Link, NavLink, useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Check } from 'react-feather'
import { CountUp } from 'use-count-up'
import { useActiveWeb3React } from '../../hooks'
import { useAggregateUniBalance, useETHBalances } from '../../state/wallet/hooks'
import { ButtonText, ExternalLink, HideMedium, TYPE } from '../../theme'
import Row, { RowFixed, RowBetween } from '../Row'
import Web3Status from './Web3Status'
import usePrevious from '../../hooks/usePrevious'
import { ReactComponent as Logo } from '../../assets/svg/antimatter_logo.svg'
import ToggleMenu from './ToggleMenu'
import { ButtonOutlinedPrimary } from 'components/Button'
import { ReactComponent as AntimatterIcon } from 'assets/svg/antimatter_icon.svg'
import { useToggleCreationModal, useWalletModalToggle } from 'state/application/hooks'
import CreationNFTModal from 'components/Creation'
import { useCurrentUserInfo, useLogin, useLogOut } from 'state/userInfo/hooks'
import { shortenAddress } from 'utils'
import { AutoColumn } from 'components/Column'
import Copy from 'components/AccountDetails/Copy'
import { UserInfoTabRoute, UserInfoTabs } from 'pages/User'
import { ChevronDown } from 'react-feather'
import { ReactComponent as BSCInvert } from '../../assets/svg/binance.svg'
import { ReactComponent as ETH } from '../../assets/svg/eth_logo.svg'
import { useWeb3React } from '@web3-react/core'
import { Modal } from '@material-ui/core'
import { CHAIN_ETH_NAME } from '../../constants'
import useBreakpoint from 'hooks/useBreakpoint'

const activeClassName = 'ACTIVE'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const tabs: Tab[] = [
  { title: 'Spot Index', route: 'spot_index' },
  { title: 'Locker', route: 'locker' },
  { title: 'Collectables', route: 'collectables' },
  { title: 'Governance', link: 'https://governance.antimatter.finance/' }
]

const NetworkInfo: {
  [key: number]: {
    title: string
    color: string
    icon: JSX.Element
    link?: string
    linkIcon?: JSX.Element
    symbol: string
  }
} = {
  1: {
    color: '#FFFFFF',
    icon: <ETH />,
    link: 'https://app.antimatter.finance',
    title: 'ETH',
    symbol: CHAIN_ETH_NAME[1]
  },
  56: {
    color: '#f8d76b',
    icon: <BSCInvert />,
    link: 'https://app.antimatter.finance',
    title: 'BSC',
    symbol: CHAIN_ETH_NAME[56]
  },
  250: {
    color: '#29516e',
    icon: <img src="https://assets.spookyswap.finance/tokens/FTM.png" alt="" width="24px" style={{ marginRight: 5 }} />,
    link: 'https://app.antimatter.finance',
    title: 'FTM',
    symbol: CHAIN_ETH_NAME[250]
  },
  43114: {
    color: '#29516e',
    icon: (
      <img
        src="https://raw.githubusercontent.com/sushiswap/icons/master/token/avax.jpg"
        alt=""
        width="24px"
        style={{ marginRight: 5 }}
      />
    ),
    link: 'https://app.antimatter.finance',
    title: 'AVAX',
    symbol: CHAIN_ETH_NAME[43114]
  }
}

export const headerHeightDisplacement = '32px'

const HeaderFrame = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  width: 100%;
  top: 0;
  height: ${({ theme }) => theme.headerHeight};
  position: relative;
  padding: 21px 32px 0;
  z-index: 6;
  background-color: ${({ theme }) => theme.bg1};

  ${({ theme }) => theme.mediaWidth.upToLarge`
  padding: 21px 20px 0;
`}
  ${({ theme }) => theme.mediaWidth.upToMedium`
  height: ${({ theme }) => theme.mobileHeaderHeight};
    grid-template-columns: 1fr;
    width: 100%;
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-self: flex-end;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: ${theme.headerHeight};
    flex-direction: row;
    align-items: center;
    justify-self: center;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    background-color: ${theme.bg1};
    justify-content: center;
  `};
`

const HeaderRow = styled(RowFixed)`
  width: 100%;
  align-items: flex-start
    ${({ theme }) => theme.mediaWidth.upToMedium`
   align-items: center
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 32px;
  white-space: nowrap;
  padding: ${({ active }) => (active ? '14px 16px' : 'unset')};
  padding-right: 0;
  height: 44px;
`

const UNIAmount = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 13px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  width: fit-content;
  position: relative;
  div {
    color: ${({ theme }) => theme.text1};
  }
  &:after {
    content: '';
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    margin-left: 16px;
    height: 20px;
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.text2};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg1};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledLogo = styled(Logo)`
  margin-right: 60px;
`

const MobileHeader = styled.header`
  width: 100%;
  min-width: ${({ theme }) => theme.minContentWidth};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: ${({ theme }) => theme.bg1};
  height: ${({ theme }) => theme.mobileHeaderHeight};
  top: 0;
  position: fixed;
  left: 0;
  z-index: 100;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: inherit
`};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  width: auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
    display: none
`};
`

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  width: fit-content;
  margin: 0 15px;
  font-weight: 400;
  padding: 10px 0 31px;
  white-space: nowrap;
  transition: 0.5s;
  border-bottom: 1px solid transparent;
  &.${activeClassName} {
    color: ${({ theme }) => theme.text1};
    border-bottom: 1px solid ${({ theme }) => theme.primary1};
  }
  :hover,
  :focus {
    color: ${({ theme }) => theme.text1};
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
  margin: 0 10px;
  `}
`
const StyledExternalLink = styled(ExternalLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  width: fit-content;
  margin: 0 15px;
  font-weight: 400;
  padding: 10px 0 31px;
  white-space: nowrap;
  transition: 0.5s;
  border-bottom: 1px solid transparent;
  &.${activeClassName} {
    color: ${({ theme }) => theme.text1};
    border-bottom: 1px solid ${({ theme }) => theme.text1};
  }
  :hover,
  :focus {
    color: ${({ theme }) => theme.text1};
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
  margin: 0 10px;
  `}
`

const UserButtonWrap = styled.div`
  position: relative;
  :hover {
    div {
      opacity: 1;
      visibility: visible;
    }
  }
  div {
    opacity: 0;
    visibility: hidden;
  }
`

const UserButton = styled(ButtonText)<{ isOpen: boolean; size?: string }>`
  height: ${({ size }) => size ?? '44px'};
  width: ${({ size }) => size ?? '44px'};
  border-radius: 50%;
  background: #263238;
  border: none;
  flex-shrink: 0;
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: center;
  align-items: center;
  transition: 0.4s;
  :disabled {
    cursor: auto;
  }
`

const UserMenuWrapper = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 2000;
  min-width: 15rem;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
  border-radius: 16px;
  transition-duration: 0.3s;
  transition-property: visibility, opacity;
  display: flex;
  border: 1px solid #ededed;
  flex-direction: column;
  & > div:first-child {
    padding: 16px 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ededed;
    width: 100%;
  }
  & > button:last-child {
    padding: 16px 24px;
    border-top: 1px solid #ededed;
  }
`

const UserMenuItem = styled.button`
  padding: 12px 24px;
  width: 100%;
  border: none;
  background-color: transparent;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  :hover {
    background-color: #ededed;
  }
`
const HeaderElement = styled.div<{
  show?: boolean
}>`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const NetworkCard = styled.div<{ color?: string }>`
  color: #000000;
  border: 1px solid #ededed;
  cursor: pointer;
  display: flex;
  padding: 4px 10px;
  height: 40px;
  margin-top: 2px;
  margin-right: 12px;
  margin-left: 19px;
  justify-content: center;
  border-radius: 4px;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  position: relative;
  background: ${({ theme }) => theme.bg1};
  & > svg:first-child {
    height: 20px;
    width: 20px;
  }
  .dropdown_wrapper {
    & > div {
      background: ${({ theme }) => theme.bg1};
      a {
        padding: 12px 12px 12px 44px;
      }
    }
  }
  :hover {
    cursor: pointer;
    .dropdown_wrapper {
      top: 100%;
      left: -20px;
      height: 10px;
      position: absolute;
      width: 172px;
      & > div {
        height: auto;
        margin-top: 10px;
        border: 1px solid #ededed;
        a {
          position: relative;
          & > svg {
            height: 20px;
            width: 20px;
            margin-right: 15px;
          }
        }
      }
    }
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0
    margin-right: 10px;
    :hover {
      cursor: auto;
      .dropdown_wrapper {display:none}
    }
  `};
`

const Dropdown = styled.div`
  z-index: 3;
  height: 0;
  position: absolute;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 172px;
  > div {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg1};
    text-decoration: none;
    padding: 14px 17px;
    border-bottom: 1px solid #ededed;
    transition: 0.5s;
    display: flex;
    align-items: center;
    padding-left: 35px;
    .icon {
      margin-left: 10px;
      margin-right: 10px;
      svg {
        width: 26px;
        height: 26px;
      }
    }
    :last-child {
      border: none;
    }
    :hover {
      background: ${({ theme }) => theme.primary2};
    }
  }
`
const StyledModalNotice = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  width: 400px;
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%);
  background-color: #424242;
  padding: 16px 32px 24px;
  #simple-modal-description {
    font-size: 18px;
  }
  :focus-visible {
    outline: none;
  }
`
function ModalNotice({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  return (
    <Modal
      open={isOpen}
      onClose={onDismiss}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <StyledModalNotice>
        <h2 id="simple-modal-title">Tips</h2>
        <p id="simple-modal-description">Please switch to Ethereum.</p>
      </StyledModalNotice>
    </Modal>
  )
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { library } = useWeb3React()
  const userInfo = useCurrentUserInfo()
  const { login } = useLogin()
  const history = useHistory()
  const isDownLg = useBreakpoint('lg')
  const match = useRouteMatch('/profile')
  const toggleCreationModal = useToggleCreationModal()
  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()
  const ETHBalance = useETHBalances(account ? [account] : [])[account ?? '']
  const countUpValue = aggregateBalance?.toFixed(1) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'
  const countETHUpValue = ETHBalance?.toFixed(1) ?? '0'
  const countETHUpValuePrevious = usePrevious(countETHUpValue) ?? '0'
  const [netNotice, setNetNotice] = useState(false)
  const onCreateOrLogin = useCallback(() => {
    if (userInfo && userInfo.token) toggleCreationModal()
    else login()
  }, [userInfo, login, toggleCreationModal])

  const toShowUserPanel = useCallback(() => {
    if (userInfo && userInfo.token) {
      history.push('/profile')
      return
    } else login()
  }, [userInfo, login, history])

  return (
    <HeaderFrame>
      <HeaderRow>
        <Link to={'/'}>
          <StyledLogo />
        </Link>
        <HeaderLinks>
          {tabs.map(({ title, route, link }) => {
            if (route) {
              return (
                <StyledNavLink to={'/' + route} key={route}>
                  {title}
                </StyledNavLink>
              )
            }
            if (link) {
              return (
                <StyledExternalLink href={link} key={link}>
                  {title}
                </StyledExternalLink>
              )
            }
            return null
          })}
        </HeaderLinks>
        <div style={{ paddingLeft: 8, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <HeaderControls>
            <HeaderElement show={!!account}>
              {chainId && NetworkInfo[chainId] && (
                <NetworkCard title={NetworkInfo[chainId].title} color={NetworkInfo[chainId as number]?.color}>
                  {NetworkInfo[chainId as number]?.icon}
                  <span style={{ width: 5 }}></span>
                  {NetworkInfo[chainId].title}
                  <HideMedium>
                    <ChevronDown size={18} style={{ marginLeft: '5px' }} />
                  </HideMedium>
                  <span style={{ width: 5 }}></span>
                  <div className="dropdown_wrapper">
                    <Dropdown>
                      {Object.keys(NetworkInfo).map(key => {
                        const info = NetworkInfo[parseInt(key) as keyof typeof NetworkInfo]
                        if (!info) {
                          return null
                        }
                        return (
                          <div
                            key={info.title}
                            onClick={() => {
                              if (
                                info.title === 'BSC' &&
                                chainId !== 56 &&
                                library &&
                                library.provider &&
                                library.provider.request
                              ) {
                                library.provider.request({
                                  method: 'wallet_addEthereumChain',
                                  params: [
                                    {
                                      chainId: `0x${Number(56).toString(16)}`,
                                      chainName: 'Binance Smart Chain Mainnet',
                                      nativeCurrency: {
                                        name: 'BNB',
                                        symbol: 'BNB',
                                        decimals: 18
                                      },
                                      rpcUrls: [
                                        'https://bsc-dataseed3.binance.org',
                                        'https://bsc-dataseed1.binance.org',
                                        'https://bsc-dataseed2.binance.org'
                                      ],
                                      blockExplorerUrls: ['https://bscscan.com/']
                                    }
                                  ]
                                })
                              } else if (
                                info.title === 'FTM' &&
                                chainId !== 250 &&
                                library &&
                                library.provider &&
                                library.provider.request
                              ) {
                                library.provider.request({
                                  method: 'wallet_addEthereumChain',
                                  params: [
                                    {
                                      chainId: `0x${Number(250).toString(16)}`,
                                      chainName: 'Fantom Opera',
                                      nativeCurrency: {
                                        name: 'FTM',
                                        symbol: 'FTM',
                                        decimals: 18
                                      },
                                      rpcUrls: ['https://rpc.ftm.tools/'],
                                      blockExplorerUrls: ['https://ftmscan.com/']
                                    }
                                  ]
                                })
                              } else if (
                                info.title === 'AVAX' &&
                                chainId !== 43114 &&
                                library &&
                                library.provider &&
                                library.provider.request
                              ) {
                                library.provider.request({
                                  method: 'wallet_addEthereumChain',
                                  params: [
                                    {
                                      chainId: `0x${Number(43114).toString(16)}`,
                                      chainName: 'Avalanche',
                                      nativeCurrency: {
                                        name: 'AVAX',
                                        symbol: 'AVAX',
                                        decimals: 18
                                      },
                                      rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                                      blockExplorerUrls: ['https://cchain.explorer.avax.network']
                                    }
                                  ]
                                })
                              } else if (chainId !== 1 && info.title === 'ETH') {
                                setNetNotice(true)
                              }
                            }}
                          >
                            {parseInt(key) === chainId && (
                              <span style={{ position: 'absolute', left: '15px' }}>
                                <Check size={18} />
                              </span>
                            )}
                            <span className="icon"> {info.linkIcon ?? info.icon}</span>
                            {info.title}
                          </div>
                        )
                      })}
                    </Dropdown>
                  </div>
                </NetworkCard>
              )}
            </HeaderElement>

            {account && (
              <HideMedium>
                <ButtonOutlinedPrimary
                  width={isDownLg ? '35px' : '120px'}
                  height={isDownLg ? 35 : 44}
                  onClick={onCreateOrLogin}
                >
                  {isDownLg ? '+' : ' Create'}
                </ButtonOutlinedPrimary>
              </HideMedium>
            )}

            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {chainId === ChainId.MAINNET && !!account && aggregateBalance && (
                <UNIAmount style={{ pointerEvents: 'none' }}>
                  {account && (
                    <CountUp
                      key={countUpValue}
                      isCounting
                      start={parseFloat(countUpValuePrevious)}
                      end={parseFloat(countUpValue)}
                      thousandsSeparator={','}
                      duration={1}
                    />
                  )}
                  MATTER
                </UNIAmount>
              )}
              {chainId !== ChainId.MAINNET && !!account && ETHBalance && (
                <UNIAmount style={{ pointerEvents: 'none' }}>
                  {account && (
                    <TYPE.gray
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countETHUpValue}
                        isCounting
                        start={parseFloat(countETHUpValuePrevious)}
                        end={parseFloat(countETHUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.gray>
                  )}
                  {NetworkInfo[chainId ?? 1] ? NetworkInfo[chainId ?? 1].symbol : ''}
                </UNIAmount>
              )}
              <Web3Status />
              {userInfo && userInfo.token ? (
                <UserButtonWrap>
                  <UserButton id="userButton" onClick={toShowUserPanel} isOpen={!!match}>
                    <AntimatterIcon />
                  </UserButton>
                  <UserMenu account={account} />
                </UserButtonWrap>
              ) : (
                account && (
                  <UserButton onClick={toShowUserPanel} isOpen={!!match}>
                    <AntimatterIcon />
                  </UserButton>
                )
              )}
            </AccountElement>
          </HeaderControls>
        </div>
      </HeaderRow>
      <MobileHeader>
        <RowBetween>
          <Link to={'/'}>
            <StyledLogo />
          </Link>
          <ToggleMenu onCreate={onCreateOrLogin} />
        </RowBetween>
      </MobileHeader>

      <CreationNFTModal />
      <ModalNotice
        isOpen={netNotice}
        onDismiss={() => {
          setNetNotice(false)
        }}
      />
    </HeaderFrame>
  )
}

function UserMenu({ account }: { account?: string | null }) {
  const logout = useLogOut()
  const toggleWalletModal = useWalletModalToggle()
  const history = useHistory()

  return (
    <UserMenuWrapper>
      <div>
        <UserButton isOpen={true} disabled size="28px">
          <AntimatterIcon />
        </UserButton>
        <TYPE.darkGray fontWeight={400} style={{ marginLeft: 15 }}>
          {account && shortenAddress(account)}
        </TYPE.darkGray>
        {account && <Copy toCopy={account} fixedSize />}
      </div>
      <div>
        <AutoColumn style={{ width: '100%' }}>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.POSITION)}>
            {UserInfoTabRoute[UserInfoTabs.POSITION]}
          </UserMenuItem>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.INDEX)}>
            {UserInfoTabRoute[UserInfoTabs.INDEX]}
          </UserMenuItem>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.LOCKER)}>
            {UserInfoTabRoute[UserInfoTabs.LOCKER]}
          </UserMenuItem>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.NFT)}>
            {UserInfoTabRoute[UserInfoTabs.NFT]}
          </UserMenuItem>
          <UserMenuItem onClick={toggleWalletModal}>Wallet</UserMenuItem>
          <UserMenuItem onClick={() => history.push('/profile/settings')}>Settings</UserMenuItem>
        </AutoColumn>
      </div>
      <UserMenuItem onClick={logout}>Logout</UserMenuItem>
    </UserMenuWrapper>
  )
}

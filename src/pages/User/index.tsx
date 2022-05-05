import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { CurrencyAmount, JSBI } from '@uniswap/sdk'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Text } from 'rebass'
import { AutoColumn } from 'components/Column'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { ButtonPrimary, ButtonWhite } from 'components/Button'
import { AnimatedWrapper, HideSmall, TYPE, ShowSmall } from 'theme'
import CopyHelper from 'components/AccountDetails/Copy'
import ProfileFallback from 'assets/images/profile-fallback.png'
import NFTCard, { NFTCardWidth /*, { NFTArtCard }*/ } from 'components/NFTCard'
import Table /*, { OwnerCell }*/ from 'components/Table'
// import { ReactComponent as Buy } from 'assets/svg/buy.svg'
// import { ReactComponent as Send } from 'assets/svg/send.svg'
// import { ReactComponent as Sell } from 'assets/svg/sell.svg'
// import { ReactComponent as Claim } from 'assets/svg/claim.svg'
import { ReactComponent as Settings } from 'assets/svg/settings.svg'
import { ReactComponent as LogOut } from 'assets/svg/log_out.svg'
import ProfileSetting from './ProfileSetting'
import { useCurrentUserInfo, useLogOut } from 'state/userInfo/hooks'
import { usePositionList, useIndexList, useMyLockerList } from 'hooks/useMyList'
import Pagination from 'components/Pagination'
import ClaimModal from 'components/claim/MatterClaimModal'
import { useCreatorFee } from 'hooks/useMatterClaim'
import { SwitchTabWrapper, Tab } from 'components/SwitchTab'
import { isMobile } from 'react-device-detect'
import { shortenAddress } from 'utils'
import { useMyBlindBox } from 'hooks/useBlindBox'
import { Box } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import AnimatedSvg from 'components/AnimatedSvg'

export enum UserInfoTabs {
  POSITION = 'my_position',
  INDEX = 'my_index',
  LOCKER = 'my_locker',
  NFT = 'my_nfts'
  // ACTIVITY = 'Activity'
}

export const UserInfoTabRoute = {
  [UserInfoTabs.POSITION]: 'My Position',
  [UserInfoTabs.INDEX]: 'My Index',
  [UserInfoTabs.LOCKER]: 'My Locker',
  [UserInfoTabs.NFT]: 'My NFTs'
}

// enum Actions {
//   BUY = 'Buy',
//   SELL = 'Sell',
//   CLAIM = 'Claim',
//   SEND = 'Send'
// }

// const ActionIcons = {
//   [Actions.BUY]: <Buy />,
//   [Actions.SELL]: <Sell />,
//   [Actions.SEND]: <Send />,
//   [Actions.CLAIM]: <Claim />
// }

const ContentWrapper = styled.div`
  position: relative;
  margin: auto;
  display: grid;
  width: 100%;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fill, ${NFTCardWidth});
  padding-bottom: 52px;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`padding: 0`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 10px;
    grid-template-columns: 100%;
  `}
`

// const ArtContentWrapper = styled.div`
//   position: relative;
//   margin: auto;
//   display: grid;
//   width: 100%;
//   grid-gap: 12px;
//   grid-template-columns: repeat(auto-fill, 280px);
//   padding-bottom: 52px;
//   justify-content: center;
//   ${({ theme }) => theme.mediaWidth.upToLarge`padding: 0`}
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//   grid-template-columns: 1fr 1fr;
// `}
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//   padding: 10px;
//   grid-template-columns: 100%;
// `}
// `

const Wrapper = styled.div`
  padding: 78px 20px 88px;
  max-width: ${({ theme }) => theme.maxContentWidth}
  display: grid;
  width: 100%;
  margin-bottom: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0 20px 40px;
  `}
`

const AppBody = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 32px;
  padding: 48px 20px 52px;
  max-width: 1284px;
  min-height: 400px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 20px 12px;
  `}
`

const ProfileImg = styled.div<{ url?: string }>`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  margin-bottom: auto;
  margin-top: 10px;
  background: ${({ url }) => (url ? `url(${url})` : `url(${ProfileFallback})`)};
  background-size: contain;
  ${({ theme }) => theme.mediaWidth.upToSmall`
 margin:0
  `}
`

const Capsule = styled.p`
  padding: 5px 10px;
  border: 1px solid #000000;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 400;
  margin-left: 12px;
`

const Synopsis = styled.p`
  max-width: 80%;
  overflow-wrap: anywhere;
  margin-top: 30px;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  text-align: center;
  max-width: unset;
  `}
`

const HeaderWrapper = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: center;
    padding:30px 20px;
  `}
`

const AddressWrapper = styled(AutoRow)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: center;
  `}
`

const ClaimWrapper = styled(RowBetween)`
  justify-content: flex-end;
  margin-bottom: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: center;
`}
`
const CardImgWrapper = styled(AutoColumn)`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 20px 20px 15px;
  grid-gap: 10px;
  span:first-child {
    color: #000;
    font-size: 20px;
  }
  span:last-child {
    color: ${({ theme }) => theme.text2};
    font-size: 14px;
  }
  a {
    font-size: 14px;
    line-height: 133.5%;
    text-align: center;
    text-decoration-line: underline;
    color: #000000;
    opacity: 0.5;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  span:first-child {  font-size: 16px;}
  span:last-child { font-size: 12px;}
   `}
`

const CardImg = styled.img`
  border-radius: 20px;
  width: 100%;
  min-height: 40px;
  height: auto;
`

const Divider = styled.div`
  width: 80px;
  height: 0;
  border-bottom: 1px solid border: 1px solid rgba(37, 37, 37, 0.1);
  margin: 20px auto 0;
`

const NoContent = styled.div`
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
`

const NameWrapper = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 auto;
  `}
`

function ShowNFTImage({ tokenURI }: { tokenURI: string }) {
  const [imgSrc, setImgSrc] = useState('')
  useEffect(() => {
    fetch(tokenURI)
      .then(res => res.json())
      .then(res => setImgSrc(res.image as string))
  }, [tokenURI])
  return <CardImg src={imgSrc || ''} alt="" />
}

export default function User() {
  const history = useHistory()
  const { tab } = useParams<{ tab: string }>()
  const location = useLocation()
  const isDownMd = useBreakpoint('md')
  const [currentTab, setCurrentTab] = useState(UserInfoTabs.POSITION)
  const [showSetting, setShowSetting] = useState(false)
  const userInfo = useCurrentUserInfo()
  const { data: positionCardList, loading: positionIsLoading, page: positionPage } = usePositionList(userInfo)
  const { data: indexList, page: indexPage, loading: indexIsLoading } = useIndexList(userInfo)
  const { data: myLockerList, page: myLockerPage, loading: myLockerIsLoading } = useMyLockerList(userInfo)

  const logout = useLogOut()
  const claimFee = useCreatorFee()
  const [claimModal, setClaimModal] = useState(false)

  const handleTabClick = useCallback(
    tab => () => {
      setCurrentTab(tab)
      history.push('/profile/' + tab)
    },
    [history]
  )

  const handleHideSetting = useCallback(() => {
    setShowSetting(false)
    history.push('/profile/' + currentTab)
  }, [currentTab, history])

  const handleShowSetting = useCallback(() => {
    setShowSetting(true)
    history.push('/profile/settings')
  }, [history])

  const handleLogOut = useCallback(() => {
    logout()
  }, [logout])

  const indexData = useMemo(
    () =>
      indexList.map(({ indexId, indexName, totalNftAmount, totalCreatorFee }) => [
        indexId,
        indexName,
        totalNftAmount,
        CurrencyAmount.ether(JSBI.BigInt(totalCreatorFee ?? '')).toSignificant(6)
        // <ActionButton onClick={() => {}} key={indexId} />
      ]),
    [indexList]
  )
  useEffect(() => {
    if (tab && UserInfoTabRoute[tab as keyof typeof UserInfoTabRoute]) {
      setCurrentTab(tab as UserInfoTabs)
      setShowSetting(false)
    }
    tab && tab === 'settings' && handleShowSetting()
  }, [handleShowSetting, location, tab])

  const { ret: myMlindBoxData, loading: myMlindBoxLoading } = useMyBlindBox()

  return (
    <>
      <ProfileSetting isOpen={showSetting} onDismiss={handleHideSetting} userInfo={userInfo} />
      <Wrapper>
        <HeaderWrapper>
          <Box display="flex" alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
            <ShowSmall />
            <Box
              display={{ xs: 'grid', md: 'flex' }}
              alignItems={'flex-start'}
              gap={18}
              justifyItems={{ xs: 'center', sm: 'flex-start' }}
            >
              <ProfileImg />
              <AutoColumn>
                <NameWrapper>
                  <Text fontSize={28} fontWeight={500}>
                    {userInfo?.username}
                  </Text>
                  <Capsule>#{userInfo?.id}</Capsule>
                </NameWrapper>
                <TYPE.darkGray fontWeight={400}>
                  <AddressWrapper>
                    {isDownMd || isMobile
                      ? userInfo && userInfo.account && shortenAddress(userInfo.account)
                      : userInfo?.account}{' '}
                    <CopyHelper toCopy={userInfo?.account ?? ''} />
                  </AddressWrapper>
                </TYPE.darkGray>
                <Synopsis>{userInfo?.bio}</Synopsis>
              </AutoColumn>
            </Box>
            <ShowSmall />
            <HideSmall>
              <RowFixed>
                <ButtonWhite width="134px" marginRight="12px" onClick={handleShowSetting}>
                  <Settings style={{ marginRight: 15 }} />
                  Settings
                </ButtonWhite>
                <ButtonWhite width="134px" onClick={handleLogOut}>
                  <LogOut style={{ marginRight: 15 }} /> Log Out
                </ButtonWhite>
              </RowFixed>
            </HideSmall>
          </Box>
          <ShowSmall>
            <Divider />
          </ShowSmall>

          <ClaimWrapper>
            <Box display="grid" gap="8px" justifyItems={'flex-end'}>
              <TYPE.darkGray style={{ display: 'flex', alignItems: 'center' }} fontSize={14}>
                Unclaim Fees:&nbsp;&nbsp; <TYPE.black fontSize={20}> {claimFee ?? '-'}</TYPE.black>
              </TYPE.darkGray>
              <ButtonPrimary
                width="134px"
                // disabled={!!(Number(claimFee) <= 0)}
                onClick={() => {
                  setClaimModal(true)
                }}
              >
                Claim Fees
              </ButtonPrimary>
            </Box>
          </ClaimWrapper>
          <ShowSmall style={{ justifyContent: 'center' }}>
            <RowFixed>
              <ButtonWhite width="134px" marginRight="12px" onClick={handleShowSetting}>
                <Settings style={{ marginRight: 15 }} />
                Settings
              </ButtonWhite>
              <ButtonWhite width="134px" onClick={handleLogOut}>
                <LogOut style={{ marginRight: 15 }} /> Log Out
              </ButtonWhite>
            </RowFixed>
          </ShowSmall>
        </HeaderWrapper>
        <AppBody>
          <AutoColumn gap="40px" style={{ position: 'relative' }}>
            <SwitchTab onTabClick={handleTabClick} currentTab={currentTab} />
            {((currentTab === UserInfoTabs.INDEX && indexIsLoading) ||
              (currentTab === UserInfoTabs.POSITION && positionIsLoading) ||
              (currentTab === UserInfoTabs.LOCKER && myLockerIsLoading) ||
              (currentTab === UserInfoTabs.NFT && myMlindBoxLoading)) && (
              <>
                <AnimatedWrapper style={{ marginTop: 40 }}>
                  <AnimatedSvg fileName="loader" />
                </AnimatedWrapper>
              </>
            )}
            {!positionIsLoading && currentTab === UserInfoTabs.POSITION /*|| currentTab === Tabs.LOCKER*/ && (
              <>
                {positionCardList.length === 0 ? (
                  <NoContent>You have no NFT at the moment</NoContent>
                ) : (
                  <>
                    <ContentWrapper>
                      {positionCardList.map(item => {
                        if (!item || !item.id || !item.creator) return null
                        const { color, address, icons, indexId, creator, name, id } = item
                        return (
                          <NFTCard
                            id={id}
                            color={color}
                            address={address}
                            icons={icons}
                            indexId={indexId}
                            key={indexId + id}
                            creator={creator}
                            name={name}
                            onClick={() => {
                              history.push(`/spot_detail/${indexId}`)
                            }}
                          />
                        )
                      })}
                    </ContentWrapper>
                    {positionPage.totalPages !== 0 && (
                      <Pagination
                        page={positionPage.currentPage}
                        count={positionPage.totalPages}
                        setPage={positionPage.setCurrentPage}
                        isLightBg
                      />
                    )}
                  </>
                )}
              </>
            )}
            {!indexIsLoading && currentTab === UserInfoTabs.INDEX && (
              <>
                <Table
                  header={['Index ID', 'Index Name', 'Current Issurance', 'Fees Earned']}
                  rows={indexData}
                  isHeaderGray
                />
                {indexPage.totalPages !== 0 && (
                  <Pagination
                    page={indexPage.currentPage}
                    count={indexPage.totalPages}
                    setPage={indexPage.setCurrentPage}
                    isLightBg
                  />
                )}
              </>
            )}
            {!myLockerIsLoading && currentTab === UserInfoTabs.LOCKER /*|| currentTab === Tabs.LOCKER*/ && (
              <>
                {myLockerList.length === 0 && !myMlindBoxLoading ? (
                  <NoContent>You have no NFT at the moment</NoContent>
                ) : (
                  <>
                    <ContentWrapper>
                      {myLockerList.map(item => {
                        if (!item || item.indexId === undefined) return null
                        const { color, address, icons, indexId, creator, name, id } = item
                        return (
                          <NFTCard
                            createName="Locker ID"
                            id={id}
                            color={color}
                            address={address}
                            icons={icons}
                            indexId={indexId}
                            key={indexId}
                            creator={creator}
                            name={name}
                            onClick={() => {
                              history.push(`/locker/${indexId}`)
                            }}
                          />
                        )
                      })}
                    </ContentWrapper>
                    {myLockerPage.totalPages !== 0 && (
                      <Pagination
                        page={myLockerPage.currentPage}
                        count={myLockerPage.totalPages}
                        setPage={myLockerPage.setCurrentPage}
                        isLightBg
                      />
                    )}
                  </>
                )}
              </>
            )}
            {currentTab === UserInfoTabs.NFT && !myMlindBoxLoading && (
              <>
                {myMlindBoxData.length === 0 ? (
                  <NoContent>You have no NFT at the moment</NoContent>
                ) : (
                  <ContentWrapper style={{ justifyContent: 'flex-start' }}>
                    {myMlindBoxData.map(({ id, tokenURI }) => (
                      <CardImgWrapper key={id}>
                        <ShowNFTImage tokenURI={tokenURI} />
                        <RowBetween>
                          <RowFixed>
                            <span>#{id}&nbsp;</span>
                            <span>/66</span>
                          </RowFixed>
                          <a
                            href={`https://opensea.io/assets/0x05739eB0B2e3F4545a6EFacABAdc85dB2DE730FD/${id}`}
                            target="__blank"
                            rel="noreferrer"
                          >
                            Open in OpenSea
                          </a>
                        </RowBetween>
                      </CardImgWrapper>
                    ))}
                  </ContentWrapper>
                )}
              </>
            )}
            {/* {positionCardList.length === 0 ? (
                  <span>You have no NFT at the moment</span>
                ) : (
                  <> */}
            {/* <ArtContentWrapper>
                  <NFTArtCard imgSrc="" />
                  <NFTArtCard imgSrc="" />
                  <NFTArtCard imgSrc="" />
                  <NFTArtCard imgSrc="" />
                </ArtContentWrapper> */}
            {/* {positionPage.totalPages !== 0 && (
                      <Pagination
                        page={positionPage.currentPage}
                        count={positionPage.totalPages}
                        setPage={positionPage.setCurrentPage}
                        isLightBg
                      />
                    )}
                  </>
                )} */}
            {/* </>
            )} */}

            {/* {currentTab === Tabs.ACTIVITY && (
                <Table
                  header={['Catagory', 'IndexId', 'Action', 'Owner', 'Date']}
                  rows={dummyActivityData}
                  isHeaderGray
                />
              )} */}
          </AutoColumn>
        </AppBody>
      </Wrapper>
      <ClaimModal
        claimFee={claimFee}
        isOpen={claimModal}
        onDismiss={() => {
          setClaimModal(false)
        }}
      />
    </>
  )
}

function SwitchTab({
  currentTab,
  onTabClick
}: {
  currentTab: UserInfoTabs
  onTabClick: (tab: UserInfoTabs) => () => void
}) {
  return (
    <SwitchTabWrapper>
      {Object.keys(UserInfoTabRoute).map(tab => {
        const tabName = UserInfoTabRoute[tab as keyof typeof UserInfoTabRoute]
        return (
          <Tab key={tab} onClick={onTabClick(tab as UserInfoTabs)} selected={currentTab === tab}>
            {tabName}
          </Tab>
        )
      })}
    </SwitchTabWrapper>
  )
}

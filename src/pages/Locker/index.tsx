import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { RowBetween } from 'components/Row'
import { ButtonOutlinedBlack, ButtonPrimary } from 'components/Button'
import Table, { OwnerCell } from 'components/Table'
import { ReactComponent as Created } from 'assets/svg/created.svg'
import { ReactComponent as Claim } from 'assets/svg/claim.svg'
import { ReactComponent as Transfer } from 'assets/svg/transfer.svg'
// import { ReactComponent as Unlock } from 'assets/svg/unlock.svg'
import { useHistory } from 'react-router-dom'
import { useLogin, useCurrentUserInfo } from 'state/userInfo/hooks'
import { LockerIndexEventType, useLockerIndexData } from '../../hooks/useLockerIndex'
import Pagination from 'components/Pagination'
import NumericalCard from 'components/Card/NumericalCard'
import { Typography } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: auto;
  padding: 60px;
  max-width: ${({ theme }) => theme.maxContentWidth}
    ${({ theme }) => theme.mediaWidth.upToLarge`
  padding: 60px;
  `}
    ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 24px;
  `};
`

const CardWrapper = styled.div`
  display: grid;
  grid-gap: 26px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  grid-template-columns: 100%;
  grid-template-rows: 1fr,1fr;
  `}
`

const OpenButton = styled(ButtonOutlinedBlack)`
  width: 100px;
  padding: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`

export default function Locker() {
  const userInfo = useCurrentUserInfo()
  const { login } = useLogin()
  const history = useHistory()
  const isDownMd = useBreakpoint('md')
  const {
    data,
    page: { currentPage, totalPages, setCurrentPage }
  } = useLockerIndexData()

  const handleLockerClick = useCallback(() => {
    if (userInfo && userInfo.token) {
      history.push('/profile/my_locker')
      return
    } else login()
  }, [userInfo, login, history])

  const tableData = useMemo(() => {
    return data.list
      .filter(i => i.eventType !== LockerIndexEventType.Claim)
      .map(item => {
        return [
          item.eventType === LockerIndexEventType.Created ? (
            <>
              <Created style={{ marginRight: 10 }} />
              Created
            </>
          ) : item.eventType === LockerIndexEventType.Transfer ? (
            <>
              <Transfer style={{ marginRight: 10 }} />
              Transfer
            </>
          ) : (
            <>
              <Claim style={{ marginRight: 10 }} />
              Claim
            </>
          ),
          item.tokenType,
          new Date(Number(item.timestamp) * 1000).toLocaleString('en-US'),
          <OwnerCell name={item.username} key="1" />,
          item.status === 0 ? (
            <OpenButton
              key="2"
              onClick={() => {
                history.push(`/locker/${item.indexId}`)
              }}
            >
              Open
            </OpenButton>
          ) : (
            <></>
          )
        ]
      })
  }, [data.list, history])

  return (
    <Wrapper>
      <AutoColumn gap={isDownMd ? '40px' : '72px'}>
        <CardWrapper>
          {/* <Card
            color={CardColor.BLUE}
            title="Total value Locked"
            value={
              <>
                -&nbsp;<span style={{ fontSize: 18 }}>$</span>
              </>
            }
          /> */}
          <NumericalCard
            value={data.lockerCreatedCount}
            subValue={<Typography fontSize={isDownMd ? 18 : 16}>Number of lockers created</Typography>}
            padding={isDownMd ? '20px' : '30px'}
            fontSize={isDownMd ? '28px' : '40px'}
          />
          <NumericalCard
            value={data.ownerCount}
            unit="Addresses"
            subValue={<Typography fontSize={isDownMd ? 18 : 16}>Number of owners</Typography>}
            padding={isDownMd ? '20px' : '30px'}
            fontSize={isDownMd ? '28px' : '40px'}
          />
        </CardWrapper>
        <AutoColumn gap="24px">
          <RowBetween>
            <TYPE.body fontWeight={700} fontSize={30}>
              Activity
            </TYPE.body>
            {userInfo && userInfo.token && (
              <ButtonPrimary
                width={isDownMd ? '108px' : '160px'}
                onClick={handleLockerClick}
                height={isDownMd ? '40px' : '44px'}
              >
                My Locker
              </ButtonPrimary>
            )}
          </RowBetween>
          <Table header={['Event', 'Token type', 'Date', 'Owner', '']} rows={tableData} />
          <Pagination
            page={currentPage}
            count={totalPages}
            setPage={page => {
              setCurrentPage(page)
            }}
          />
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}

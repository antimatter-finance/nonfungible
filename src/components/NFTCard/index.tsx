import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import Column, { AutoColumn } from 'components/Column'
import ProgressBar from './ProgressBar'
import CurrencyLogosOverlay from './CurrencyLogosOverlay'
// import CurvedText from './CurvedText'
import { RowBetween } from 'components/Row'
import { TimerCapsule, StyledCapsule } from './Capsule'
import { ellipsis } from 'polished'
import { shortenAddress } from 'utils'
import CopyHelper from 'components/AccountDetails/Copy'
import { Box } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
export { default as NFTArtCard } from './NFTArtCard'

export enum CardColor {
  RED = 'pastelRed',
  PURPLE = 'pastelPurple',
  YELLOW = 'pastelYellow',
  GREEN = 'pastelGreen',
  BLUE = 'pastelBlue'
}
export const NFTCardWidth = '271px'
export interface NFTCardProps {
  icons: React.ReactNode[]
  indexId: string
  creator: string
  name: string
  color: CardColor
  address: string
  id: string | number
  noBorderArea?: boolean
}

export interface NFTGovernanceCardProps {
  time: string
  title: string
  color: CardColor
  address: string
  synopsis: string
  voteFor: number
  voteAgainst: number
  id: string | number
  voteForPercentage: string
}

const formatSynposis = (synopsis: string) => {
  if (synopsis.length > 155) {
    return synopsis.slice(0, 150) + '...'
  }
  return synopsis
}

const CardWrapper = styled.div<{ onClick?: any }>`
  height: 394px;
  width: ${NFTCardWidth};
  background: #ffffff;
  border: 1px solid #ebecf2;
  border-radius: 30px;
  display: grid;
  justify-content: center;
  padding: 21px 20px;
  gap: 12px;
  :hover {
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'auto')};
    border-color: ${({ onClick, theme }) => (onClick ? theme.primary1 : '#ebecf2')};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  height: auto;
`}
`

const CardContent = styled.div<{ color: CardColor; padding?: string | number }>`
  background: ${({ theme, color }) => theme[color]};
  border-radius: 20px;
  height: 237px;
  width: 231px;
  position: relative;
  overflow: hidden;
  padding: ${({ padding }) => padding ?? '20px'};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  height: 145px;
  width: 264px;
`}
`

// const OutlineCard = styled.div<{ borderRadius?: string }>`
//   border: 1px solid ${({ theme }) => theme.text2};
//   height: 100%;
//   z-index: 3;
//   border-radius: ${({ borderRadius }) => borderRadius ?? '20px'};
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   padding: 24px 20px;
//   & * {
//     z-index: 3;
//   }
//   ${({ theme }) => theme.mediaWidth.upToSmall`padding-top: 20px;`}
// `

function NFTCardBase({
  children,
  color,
  address,
  noBorderArea,
  onClick,
  icons
}: {
  children: React.ReactNode
  color: CardColor
  address: string
  noBorderArea?: boolean
  onClick?: () => void
  icons?: React.ReactNode[]
}) {
  return (
    <CardWrapper onClick={onClick}>
      {children}
      <CardContent padding={noBorderArea ? 0 : '20px'} color={color}>
        {icons && <CurrencyLogosOverlay icons={icons} />}
        {/* {!noBorderArea && (
          <>
            <CurvedText text={address} />
            <CurvedText text={address} inverted />
          </>
        )} */}
        {/* <OutlineCard borderRadius={noBorderArea ? '30px' : '20px'}>{}</OutlineCard> */}
      </CardContent>
      <Box display="flex" alignItems={'center'} sx={{ opacity: 0.5 }}>
        <CopyHelper toCopy={address} />
        <TYPE.smallGray>{address ? shortenAddress(address, 12) : ''}</TYPE.smallGray>
      </Box>
    </CardWrapper>
  )
}

export default function NFTCard({
  icons,
  indexId,
  creator,
  name,
  color,
  address,
  noBorderArea,
  onClick,
  createName
}: NFTCardProps & { onClick?: () => void; createName?: string }) {
  const downMd = useBreakpoint('md')
  return (
    <NFTCardBase noBorderArea={noBorderArea} color={color} address={address} onClick={onClick} icons={icons}>
      <TYPE.black fontWeight={700} fontSize={downMd ? 20 : 22} color="#000000" style={{ ...ellipsis('100%') }}>
        {name}
      </TYPE.black>
      <Box display="flex" gap={'8px'}>
        <StyledCapsule color={'#EBECF250'} noMinWidth>
          <TYPE.smallGray>{createName ? createName : 'Index ID'}:&nbsp;</TYPE.smallGray>
          <TYPE.small color="#000000"> {indexId}</TYPE.small>
        </StyledCapsule>
        <StyledCapsule color={'#EBECF250'}>
          <TYPE.smallGray>Creator:&nbsp;</TYPE.smallGray>
          <TYPE.small color="#000000"> {creator}</TYPE.small>
        </StyledCapsule>
      </Box>
    </NFTCardBase>
  )
}

export function NFTGovernanceCard({
  time,
  title,
  color,
  address,
  synopsis,
  voteFor,
  voteAgainst,
  voteForPercentage,
  onClick
}: NFTGovernanceCardProps & { onClick: () => void }) {
  const theme = useTheme()
  return (
    <NFTCardBase color={color} address={address} onClick={onClick}>
      <Column style={{ justifyContent: 'space-between', height: '100%' }}>
        <AutoColumn gap="12px">
          <TYPE.black fontWeight={700} fontSize={24} color="#000000">
            {title}
          </TYPE.black>
          <TYPE.smallGray style={{ height: 84, overflow: 'hidden' }} fontSize={14}>
            {formatSynposis(synopsis)}
          </TYPE.smallGray>
          <TimerCapsule color={color} timeLeft={+time} />
        </AutoColumn>
        <AutoColumn gap="10px">
          <RowBetween>
            <TYPE.smallGray>Votes For:</TYPE.smallGray>
            <TYPE.smallGray>Votes Against:</TYPE.smallGray>
          </RowBetween>
          <ProgressBar leftPercentage={voteForPercentage} color={theme[color]} />
          <RowBetween>
            <TYPE.small fontSize={12}>{voteFor.toLocaleString('en-US')}&nbsp;Matter</TYPE.small>
            <TYPE.small fontSize={12}>{voteAgainst.toLocaleString('en-US')}&nbsp;Matter</TYPE.small>
          </RowBetween>
        </AutoColumn>
      </Column>
    </NFTCardBase>
  )
}

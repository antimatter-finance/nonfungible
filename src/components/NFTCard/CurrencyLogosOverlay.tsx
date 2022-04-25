import React, { useCallback } from 'react'
import styled from 'styled-components'
import useMediaWidth from 'hooks/useMediaWidth'

const LogosContainer = styled.div`
  height: 237px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  height: 75%;
  top: 20px;
  left: -10px
  `}
`

const LogoWrapper = styled.div<{ size: number; top: number; left: number }>`
  position: absolute;
  z-index: 3;
  width: ${({ size }) => size * 0.8}px;
  height: ${({ size }) => size * 0.8}px;
  top: ${({ top }) => (top * 100) / 380}%;
  left: ${({ left }) => (left * 100) / 280}%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  svg,
  img {
    height: 60%;
    width: 60%;
  }
  ${({ top, left, theme }) => theme.mediaWidth.upToSmall`
    top: ${((top * 100) / (3.5 * 145)).toFixed(1)}%;
    left: ${(left / 2.5).toFixed(1)}%;
  `}
  ${({ size, theme }) => theme.mediaWidth.upToSmall`
  width: ${((size * 2) / 3 + 10).toFixed(1)}px;
  height: ${((size * 2) / 3 + 10).toFixed(1)}px;
  `}
`

export default function CurrencyLogosOverlay({ icons = [] }: { icons: React.ReactNode[] }) {
  const match = useMediaWidth('upToSmall')
  const constructIcons = useCallback(
    (icons: React.ReactNode[]) => {
      switch (icons.length) {
        case 0:
          return null
        case 1:
          return (
            <LogoWrapper size={64} top={148} left={108}>
              {icons[0]}
            </LogoWrapper>
          )
        case 2:
          return (
            <>
              <LogoWrapper size={75} top={80} left={60}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={92} top={190} left={140}>
                {icons[1]}
              </LogoWrapper>
            </>
          )
        case 3:
          return (
            <>
              <LogoWrapper size={62} top={76} left={180}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={60} top={115} left={46}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={70} top={213} left={138}>
                {icons[2]}
              </LogoWrapper>
            </>
          )
        case 4:
          return (
            <>
              <LogoWrapper size={61} top={66} left={47}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={51} top={96} left={match ? 150 : 174}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={60} top={220} left={56}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={70} top={match ? 200 : 230} left={match ? 175 : 177}>
                {icons[3]}
              </LogoWrapper>
            </>
          )
        case 5:
          return (
            <>
              <LogoWrapper size={64} top={61} left={34}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={51} top={60} left={190}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={40} top={151} left={125}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={60} top={223} left={32}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={74} top={224} left={178}>
                {icons[4]}
              </LogoWrapper>
            </>
          )
        case 6:
          return (
            <>
              <LogoWrapper size={73} top={77} left={39}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={51} top={48} left={168}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={46} top={match ? 120 : 159} left={match ? 100 : 194}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={40} top={200} left={112}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={60} top={253} left={match ? 23 : 27}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={49} top={match ? 250 : 268} left={match ? 180 : 196}>
                {icons[5]}
              </LogoWrapper>
            </>
          )
        case 7:
          return (
            <>
              <LogoWrapper size={58} top={53} left={34}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={40} top={42} left={127}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={65} top={match ? 86 : 96} left={192}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={44} top={157} left={74}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={60} top={255} left={27}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={51} top={244} left={131}>
                {icons[5]}
              </LogoWrapper>
              <LogoWrapper size={49} top={255} left={213}>
                {icons[6]}
              </LogoWrapper>
            </>
          )

        case 8:
          return (
            <>
              <LogoWrapper size={51} top={48} left={24}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={40} top={66} left={114}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={46} top={match ? 40 : 45} left={199}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={44} top={151} left={74}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={51} top={140} left={177}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={60} top={258} left={27}>
                {icons[5]}
              </LogoWrapper>
              <LogoWrapper size={40} top={252} left={122}>
                {icons[6]}
              </LogoWrapper>
              <LogoWrapper size={49} top={258} left={202}>
                {icons[7]}
              </LogoWrapper>
            </>
          )
        default:
          return (
            <>
              <LogoWrapper size={40} top={104} left={40}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={40} top={97} left={200}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={36} top={134} left={119}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={32} top={190} left={58}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={28} top={match ? 200 : 267} left={212}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={44} top={194} left={147}>
                {icons[5]}
              </LogoWrapper>
              <LogoWrapper size={28} top={220} left={93}>
                {icons[6]}
              </LogoWrapper>
              <LogoWrapper size={40} top={270} left={195}>
                {icons[7]}
              </LogoWrapper>
              <LogoWrapper size={49} top={255} left={213}>
                {icons[8]}
              </LogoWrapper>
            </>
          )
      }
    },
    [match]
  )

  return <LogosContainer>{constructIcons(icons)}</LogosContainer>
}

import React, { useCallback } from 'react'
import styled from 'styled-components'
import useBreakpoint from 'hooks/useBreakpoint'

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
  const downMd = useBreakpoint('md')
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
              <LogoWrapper size={downMd ? 60 : 75} top={80} left={60}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 80 : 92} top={190} left={140}>
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
              <LogoWrapper size={70} top={213} left={downMd ? 110 : 138}>
                {icons[2]}
              </LogoWrapper>
            </>
          )
        case 4:
          return (
            <>
              <LogoWrapper size={downMd ? 50 : 61} top={downMd ? 60 : 66} left={47}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 45 : 51} top={downMd ? 103 : 96} left={downMd ? 130 : 174}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 53 : 60} top={downMd ? 270 : 220} left={downMd ? 70 : 56}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 65 : 70} top={downMd ? 250 : 230} left={downMd ? 175 : 177}>
                {icons[3]}
              </LogoWrapper>
            </>
          )
        case 5:
          return (
            <>
              <LogoWrapper size={downMd ? 55 : 64} top={downMd ? 50 : 61} left={downMd ? 65 : 34}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 45 : 51} top={downMd ? 30 : 60} left={190}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 34 : 40} top={151} left={125}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 52 : 60} top={downMd ? 250 : 223} left={32}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 65 : 74} top={224} left={downMd ? 155 : 178}>
                {icons[4]}
              </LogoWrapper>
            </>
          )
        case 6:
          return (
            <>
              <LogoWrapper size={downMd ? 65 : 73} top={downMd ? 0 : 77} left={downMd ? 47 : 39}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 59 : 51} top={downMd ? 30 : 48} left={168}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 35 : 46} top={downMd ? 120 : 159} left={downMd ? 110 : 194}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={40} top={downMd ? 300 : 200} left={downMd ? 130 : 112}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 55 : 60} top={253} left={downMd ? 23 : 27}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 35 : 49} top={downMd ? 280 : 268} left={downMd ? 180 : 196}>
                {icons[5]}
              </LogoWrapper>
            </>
          )
        case 7:
          return (
            <>
              <LogoWrapper size={downMd ? 50 : 58} top={downMd ? 0 : 53} left={34}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 35 : 40} top={42} left={127}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={65} top={downMd ? 0 : 96} left={192}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 35 : 44} top={157} left={74}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 51 : 60} top={255} left={27}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={51} top={244} left={131}>
                {icons[5]}
              </LogoWrapper>
              <LogoWrapper size={downMd ? 40 : 49} top={255} left={213}>
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
              <LogoWrapper size={40} top={downMd ? 0 : 66} left={114}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={46} top={downMd ? 40 : 45} left={199}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={44} top={151} left={74}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={51} top={downMd ? 130 : 140} left={downMd ? 155 : 177}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={60} top={downMd ? 300 : 258} left={27}>
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
              <LogoWrapper size={28} top={downMd ? 200 : 267} left={212}>
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
    [downMd]
  )

  return <LogosContainer>{constructIcons(icons)}</LogosContainer>
}

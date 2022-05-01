import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { AutoColumn } from '../../components/Column'
import { TYPE } from '../../theme'
import useBreakpoint from 'hooks/useBreakpoint'

export const StyledParagraph = styled.div`
  margin: 24px 0;
`

export const Hr = styled.hr`
  height: 0;
  border: 0;
  opacity: 0.1;
  border-bottom: ${({ theme }) => `1px solid ${theme.black}`};
`

export function Paragraph({ header, children, textWidth }: { header: string; children: any; textWidth?: string }) {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  return (
    <StyledParagraph>
      <AutoColumn gap="5px">
        <TYPE.subHeader color={theme.text3}>{header}</TYPE.subHeader>
        <TYPE.small
          fontSize={isDownMd ? 14 : 16}
          fontWeight={500}
          style={{
            wordBreak: 'break-all',
            maxWidth: textWidth ? textWidth : 'auto'
          }}
          color={theme.text1}
        >
          {children}
        </TYPE.small>
      </AutoColumn>
    </StyledParagraph>
  )
}

import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import Card from './Card'

interface Props {
  title?: string
  valueColor?: string
  primary?: boolean
  width?: string | number
  height?: string | number
  value?: string | React.ReactNode
  subValue?: string | JSX.Element
  unit?: string | JSX.Element
  unitSize?: string
  fontSize?: string
  gray?: boolean
  actions?: React.ReactNode
  children?: React.ReactNode
  border?: boolean
  padding?: string
  gap?: string | number
  unitFontSize?: number | string
  valueMt?: number | string
}

export default function NumericalCard(props: Props) {
  const {
    title,
    primary,
    value,
    subValue,
    unit,
    unitSize,
    fontSize,
    width,
    height,
    actions,
    children,
    border,
    padding,
    valueColor,
    valueMt
  } = props
  const theme = useTheme()

  return (
    <Card
      width={width || '100%'}
      style={{ position: 'relative', border: border ? '1px solid #00000010' : undefined, height: height || 'auto' }}
    >
      <Box
        sx={{
          padding: padding ?? '20px 20px 16px',
          gap: {
            xs: 4,
            md: 12
          },
          height: height || 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {title && (
          <Box display="flex">
            {title && (
              <Typography
                variant="inherit"
                color={primary ? theme.palette.primary.contrastText : theme.palette.text.secondary}
              >
                {title}
              </Typography>
            )}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            color: valueColor ? valueColor : primary ? theme.palette.primary.contrastText : theme.palette.text.primary,
            marginTop: valueMt ?? 0
          }}
        >
          <Typography
            sx={{
              fontSize: fontSize || 24,
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            {value}
          </Typography>
          {unit && (
            <Typography sx={{ fontSize: unitSize || 16, fontWeight: 700, ml: 4, lineHeight: 1 }}>{unit}</Typography>
          )}
        </Box>
        {subValue && (
          <Typography sx={{ fontSize: 12, fontWeight: 400, opacity: 0.5 }} align="left">
            {subValue}
          </Typography>
        )}
        {actions && <Box mt={20}>{actions}</Box>}
      </Box>

      {children}
    </Card>
  )
}

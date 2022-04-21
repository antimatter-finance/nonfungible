import { Paper } from '@mui/material'
import React from 'react'

export default function Card({
  children,
  color,
  style,
  padding,
  width
}: {
  children?: React.ReactNode
  color?: string
  style?: any
  padding?: string | number
  width?: string | number
}) {
  return (
    <Paper
      style={{
        boxShadow: 'none'
      }}
      sx={{
        background: color ?? '#ffffff',
        borderRadius: '20px',
        padding,
        width,
        ...(style ? style : {})
      }}
    >
      {children}
    </Paper>
  )
}

export function OutlinedCard({
  children,
  color,
  padding,
  width,
  style
}: {
  children: JSX.Element | React.ReactNode
  color?: string
  padding?: string | number
  width?: string | number
  style?: any
}) {
  return (
    <Paper
      variant="outlined"
      style={{
        boxShadow: 'none'
      }}
      sx={{
        backgroundColor: 'transparent',
        border: `1px solid ${color ?? 'rgba(0, 0, 0, 0.1)'}`,
        padding,
        width,
        ...(style ? style : {})
      }}
    >
      {children}
    </Paper>
  )
}

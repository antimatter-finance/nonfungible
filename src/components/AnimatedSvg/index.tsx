import React from 'react'
import { useEffect, useRef } from 'react'
import Lottie from 'lottie-web'
import { Box, SxProps } from '@mui/material'

export default function AnimatedSvg({
  fileName,
  sx,
  className,
  onClick
}: {
  fileName: string
  sx?: SxProps
  className?: string
  onClick?: () => void
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref || !ref.current) return

    Lottie.loadAnimation({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      container: ref.current!, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `/animations/${fileName}.json`
    })
  }, [fileName, ref])

  return (
    <Box
      ref={ref}
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start'
      }}
      sx={
        sx
          ? {
              '& path': {
                stroke: fileName === 'loader' ? '#25252530!important' : undefined
              },
              ...sx
            }
          : {
              '& path': {
                stroke: fileName === 'loader' ? '#25252530!important' : undefined
              }
            }
      }
      onClick={onClick}
    ></Box>
  )
}

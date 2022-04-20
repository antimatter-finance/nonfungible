import React from 'react'
import { Box, Grid, Typography, styled } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import NumericalCard from 'components/Card/NumericalCard'
import { theme } from 'theme/index'

const StyledImg = styled('img')(({ theme }) => ({
  svg: {
    marginTop: 'auto',
    maxHeight: 280,
    flexShrink: 1,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: 'auto auto 0'
    }
  }
}))

export default function ProductBanner({
  title,
  val1,
  unit1,
  subVal1,
  val2,
  unit2,
  subVal2,
  text,
  imgUrl
}: {
  title: string | JSX.Element
  val1?: string
  unit1?: string | JSX.Element
  subVal1?: string
  val2?: string
  unit2?: string | JSX.Element
  subVal2?: string | JSX.Element
  text?: string
  imgUrl?: string
}) {
  const isDownMd = useBreakpoint('md')
  const isDownSm = useBreakpoint('sm')

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        width: '100%',
        height: { xs: 'auto', md: 340 },
        padding: { xs: '30px 20px 0px', md: '40px 40px 0', lg: '20px 61px 0' }
      }}
    >
      <Box
        sx={{ maxWidth: { xs: '100%', md: theme().maxContentWidth } }}
        width="100%"
        display={{ xs: 'grid', sm: 'flex' }}
        justifyContent={{ sm: 'center', md: 'space-between' }}
        alignItems={'flex-end'}
        gap={15}
      >
        <Box display="grid" gap={12} margin="auto 0">
          <Typography component="h1" sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 700 }}>
            {title}
          </Typography>
          <Box display={{ xs: 'grid', md: 'flex' }} gap={{ xs: 8, md: 32 }} paddingBottom={{ xs: 12, md: 30 }}>
            {text}
          </Box>
          {val1 && val2 && (
            <Grid container spacing={{ xs: 8, md: 20 }} marginBottom={{ xs: 20, md: 35 }}>
              <Grid item xs={12} md={6} height={{ xs: 76, md: 'auto' }}>
                <NumericalCard
                  fontSize={isDownMd ? '20px' : undefined}
                  width={isDownSm ? '100%' : isDownMd ? '320px' : '264px'}
                  value={val1}
                  unit={unit1}
                  border
                  height={isDownMd ? 76 : 'auto'}
                  subValue={subVal1}
                  gap={isDownMd ? '12px' : undefined}
                />
              </Grid>
              <Grid item xs={12} md={6} mt={{ xs: 8, md: 0 }}>
                <NumericalCard
                  fontSize={isDownMd ? '20px' : undefined}
                  width={isDownSm ? '100%' : isDownMd ? '320px' : '264px'}
                  value={val2}
                  unit={unit2}
                  border
                  subValue={subVal2}
                  height={isDownMd ? 76 : 'auto'}
                  gap={isDownMd ? '12px' : undefined}
                />
              </Grid>
            </Grid>
          )}
        </Box>

        <StyledImg
          sx={{
            marginBottom: val1 && val2 ? 13 : -6,
            height: 'max-content'
          }}
          src={imgUrl}
          alt=""
        ></StyledImg>
      </Box>
    </Box>
  )
}

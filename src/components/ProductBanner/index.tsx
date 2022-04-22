import React from 'react'
import { Box, Grid, Typography, styled } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import NumericalCard from 'components/Card/NumericalCard'
import { theme } from 'theme/index'
import { ReactComponent as NftTag } from 'assets/svg/nft_tag.svg'

const StyledImg = styled('img')(({ theme }) => {
  return {
    maxHeight: 280,
    flexShrink: 1,
    [theme.breakpoints.down('lg')]: {
      maxHeight: 200
    },
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }
})

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

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        width: '100%',
        height: { xs: 'auto', md: 340 },
        paddingTop: { xs: '30px', md: '40px', lg: '20px' }
      }}
    >
      <Box
        sx={{ maxWidth: { xs: '100%', md: theme().maxContentWidth } }}
        width="100%"
        display={{ xs: 'grid', md: 'flex' }}
        justifyContent={{ sm: 'center', md: 'space-between' }}
        alignItems={'center'}
        gap={15}
      >
        <Box display="grid" gap={12} margin="auto 0">
          <Typography
            component="h1"
            sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 700, whiteSpace: { xs: 'normal', sm: 'nowrap' } }}
          >
            {title}
          </Typography>
          <Typography
            fontSize={{ xs: 14, md: 18 }}
            paddingBottom={{ xs: 12, md: 30 }}
            color={theme().text2}
            sx={{ maxWidth: 449 }}
          >
            {text}
          </Typography>
          {(val1 || val2) && (
            <Grid container spacing={{ xs: 8, md: 20 }} marginBottom={{ xs: 20, md: 35 }}>
              {val1 && (
                <Grid item xs={12} md={6} height={{ xs: 76, md: 'auto' }}>
                  <NumericalCard
                    fontSize={isDownMd ? '20px' : undefined}
                    width={isDownMd ? '100%' : '264px'}
                    value={val1}
                    unit={unit1}
                    border
                    height={isDownMd ? 76 : 'auto'}
                    subValue={subVal1}
                    gap={isDownMd ? '12px' : undefined}
                  >
                    <Box position="absolute" top={-6} right={-6}>
                      <NftTag />
                    </Box>
                  </NumericalCard>
                </Grid>
              )}
              {val2 && (
                <Grid item xs={12} md={6} mt={{ xs: 8, md: 0 }}>
                  <NumericalCard
                    fontSize={isDownMd ? '20px' : undefined}
                    width={isDownMd ? '100%' : '264px'}
                    value={val2}
                    unit={unit2}
                    border
                    subValue={subVal2}
                    height={isDownMd ? 76 : 'auto'}
                    gap={isDownMd ? '12px' : undefined}
                  >
                    <Box position="absolute" top={-6} right={-6}>
                      <NftTag />
                    </Box>
                  </NumericalCard>
                </Grid>
              )}
            </Grid>
          )}
        </Box>

        <StyledImg
          sx={{
            marginBottom: val1 && val2 ? 13 : -6,
            height: { xs: 'auto', lg: 'max-content' },
            display: isDownMd ? 'none' : undefined
          }}
          src={imgUrl}
          alt=""
        ></StyledImg>
      </Box>
    </Box>
  )
}

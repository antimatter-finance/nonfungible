import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { createTheme, ThemeProvider as MuiThemeProviderRaw } from '@mui/material/styles'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

export * from './components'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 600,
  upToSmall: 600,
  upToMedium: 900,
  upToLarge: 1200
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: '#252525',
    text2: 'rgba(37, 37, 37, .6)',
    text3: 'rgba(37, 37, 37, .4)',

    // backgrounds / greys
    bg1: '#FFFFFF',
    bg2: '#F2F5FA',

    //specialty colors
    modalBG: 'rgba(0,0,0,.7)',
    advancedBG: 'rgba(0,0,0,0.1)',

    //primary colors
    primary1: '#31B047',
    primary2: 'rgba(17, 191, 45, .1)',
    primary3: '#2DA241',
    primary4: '#257D34',
    primary5: 'rgba(49, 176, 71, 0.3)',

    // color text
    primaryText1: '#B2F355',

    // other
    red1: '#FF0000',
    red2: '#FF2828',
    red3: '#FF4B4B',
    green1: '#24FF00',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5',

    pastelRed: 'linear-gradient(90deg, #EBC0FD 0%, #D9DED8 100%);',
    pastelBlue: 'linear-gradient(90deg, #E0C3FC 0%, #8EC5FC 100%)',
    pastelGreen: 'linear-gradient(90deg, #A1C4FD 0%, #C2E9FB 100%)',
    pastelPurple: 'linear-gradient(90deg, #84FAB0 0%, #8FD3F4 100%)',
    pastelYellow: 'linear-gradient(90deg, #A8EDEA 0%, #FED6E3 100%)',

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
    translucent: 'rgba(255, 255, 255, 0.08)',
    gradient1:
      '#000000 linear-gradient(283.31deg, rgba(255, 255, 255, 0.18) -2.53%, rgba(255, 255, 255, 0.17) 18.66%, rgba(255, 255, 255, 0) 98.68%)',
    gradient2: '#000000 linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)'
  }
}

export function theme(): DefaultTheme {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: '#000',

    // media queries
    mediaWidth: mediaWidthTemplates,

    //rwd
    mobile: css`
      display: none;
      ${mediaWidthTemplates.upToSmall`display:inherit;`}
    `,
    desktop: css`
      ${mediaWidthTemplates.upToSmall`display:none;`}
    `,
    mobileHeaderHeight: '68px',
    headerHeight: '82px',
    maxContentWidth: '1280px',
    minContentWidth: '350px',

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeObject = useMemo(() => theme(), [])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  monument(props: TextProps) {
    return <TextWrapper color="#ffffff" fontSize={48} {...props} fontFamily="Monument" />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={24} {...props} fontFamily="SF Pro" />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={22} {...props} fontFamily="SF Pro" />
  },
  smallHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={16} {...props} fontFamily="SF Pro" />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={12} {...props} />
  },
  smallGray(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={12} color={'text2'} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'SF Pro', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'SF Pro', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

 a {
   color: ${colors().primary1}; 
 }

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  
}
`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
}
`

const MuiTheme = createTheme({
  spacing: (factor: number) => `${1 * factor}px`,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, input, textarea, button, body': {
          fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
          fontDisplay: 'fallback'
        },
        '@supports (font-variation-settings: normal)': {
          'html, input, textarea, button, body': {
            fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
            fontDisplay: 'fallback'
          }
        }
      }
    }
  },
  typography: {
    fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif!important',
    allVariants: {
      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif'
    }
  }
})

export function MuiThemeProvider({ children }: any) {
  return <MuiThemeProviderRaw theme={MuiTheme}>{children}</MuiThemeProviderRaw>
}

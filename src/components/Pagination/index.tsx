import React from 'react'
import MuiPagination from '@material-ui/lab/Pagination'
import styled from 'styled-components'
import { ThemeProvider as MaterialThemeProvider } from '@material-ui/core/styles'
import { createTheme } from '@material-ui/core/styles'
// import { theme } from 'theme'

// const materialTheme = createTheme({
//   palette: {
//     type: 'dark'
//   }
// })

const materialThemeLight = createTheme({
  palette: {
    type: 'light'
  }
})

const StyledPagination = styled.div`
  display: flex;
  color: ${({ theme }) => theme.text2};
  justify-content: center;
  & > * {
    margin-bottom: 20px;
  }
  .MuiPaginationItem-root {
    min-width: unset;
    opacity: 0.8;
  }
  .MuiPaginationItem-page.Mui-selected {
    background-color: transparent;

    color: ${({ theme }) => theme.text1};
    border-color: ${({ theme }) => theme.text1};
  }
`

interface PaginationProps {
  count: number
  page: number
  setPage: (page: number) => void
  onChange?: (event: object, page: number) => void
  isLightBg?: boolean
}
export default function Pagination({ count, page, onChange, setPage }: PaginationProps) {
  return (
    <MaterialThemeProvider theme={materialThemeLight}>
      {count > 1 && (
        <StyledPagination>
          <MuiPagination
            count={count}
            page={page}
            shape="rounded"
            variant="outlined"
            onChange={(event, page) => {
              onChange && onChange(event, page)
              setPage(page)
            }}
            size="large"
          />
        </StyledPagination>
      )}
    </MaterialThemeProvider>
  )
}

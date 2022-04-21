import React from 'react'
import styled from 'styled-components'
import { TableContainer, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import useMediaWidth from 'hooks/useMediaWidth'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import { TYPE } from 'theme'
import { Box } from '@mui/material'

interface StyleProps {
  isHeaderGray?: boolean
}

const Profile = styled.div`
  display: flex;
  align-items: center;
`

export const TableProfileImg = styled.div<{ url?: string }>`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  background: #000000 ${({ url }) => (url ? `url(${url})` : '')};
`

export function OwnerCell({ url, name }: { url?: string; name: string }) {
  return (
    <Profile>
      <TableProfileImg url={url} />
      {name}
    </Profile>
  )
}

const useStyles = makeStyles({
  root: {
    display: 'table',
    backgroundColor: '#ffffff',
    borderRadius: '40px',
    position: 'relative',
    '& .MuiTableCell-root': {
      fontSize: '16px',
      borderBottom: 'none',
      padding: '14px 20px',
      '& svg': {
        marginRight: 8
      },
      '&:first-child': {
        paddingLeft: 50
      },
      '&:last-child': {
        paddingRight: 50
      }
    },
    '& table': {
      width: '100%',
      borderCollapse: 'collapse',
      minHeight: 300
    }
  },
  tableHeader: {
    background: ({ isHeaderGray }: StyleProps) => (isHeaderGray ? 'rgba(247, 247, 247, 1)' : 'transparent'),
    borderRadius: ({ isHeaderGray }: StyleProps) => (isHeaderGray ? 14 : 0),
    overflow: 'hidden',
    '& .MuiTableCell-root': {
      padding: '22px 20px',
      fontSize: '14px',
      fontWeight: 700,
      color: '#252525',
      borderBottom: ({ isHeaderGray }: StyleProps) => (isHeaderGray ? 'none' : '1px solid #25252520'),
      '&:first-child': {
        paddingLeft: 50
      },
      '&:last-child': {
        paddingRight: 50
      }
    }
  },
  tableRow: {
    borderBottom: ({ isHeaderGray }: StyleProps) =>
      isHeaderGray ? '1px solid rgba(247, 247, 247, 1)' : '1px solid #999999',
    height: 72,
    '&:hover': {
      backgroundColor: ' rgba(178, 243, 85, 0.08)'
    },
    '&:last-child': {
      border: 'none'
    }
  }
})

const Card = styled.div`
  background: #ffffff;
  border-radius: 30px;
  padding: 24px;
  > div {
    width: 100%;
  }
`

const CardRow = styled(RowBetween)`
  grid-template-columns: auto 100%;
  > div:first-child {
    white-space: nowrap;
  }
  > div:last-child {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`

const NoContent = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
`

export default function Table({
  header,
  rows,
  isHeaderGray
}: {
  header: string[]
  rows: (string | number | JSX.Element)[][]
  isHeaderGray?: boolean
}) {
  const match = useMediaWidth('upToMedium')
  const classes = useStyles({ isHeaderGray })
  return (
    <>
      {match ? (
        <Box position="relative">
          {rows.map((data, index) => (
            <Card key={index}>
              <AutoColumn gap="16px">
                {header.map((headerString, index) => (
                  <CardRow key={headerString}>
                    <TYPE.darkGray>{headerString}</TYPE.darkGray>
                    <TYPE.body color="#000000"> {data[index] ?? null}</TYPE.body>
                  </CardRow>
                ))}
              </AutoColumn>
            </Card>
          ))}
          {!rows.length && <NoContent>No activity at the moment</NoContent>}
        </Box>
      ) : (
        <TableContainer className={classes.root}>
          <div style={{ position: 'absolute', bottom: 130, left: '50%', transform: 'translateX(-50%)' }}>
            No activity at the moment
          </div>
          <table>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                {header.map((string, idx) => (
                  <TableCell key={idx}>{string}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={row[0].toString() + idx} className={classes.tableRow}>
                  {row.map((data, idx) => (
                    <TableCell key={idx}>{data}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </table>
        </TableContainer>
      )}
    </>
  )
}

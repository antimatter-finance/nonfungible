import React, { useMemo } from 'react'
import { NFTTransactionRecordsProps } from '../../hooks/useIndexDetail'
import { shortenAddress } from 'utils'
import styled from 'styled-components'
import Table from '@material-ui/core/Table'
import { TableContainer, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'

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
    maxHeight: '100px',
    '& .MuiTableCell-root': {
      fontSize: '12px',
      borderBottom: 'none',
      padding: '10px 15px',
      '& svg': {
        marginRight: 8
      },
      '&:first-child': {
        paddingLeft: 10
      },
      '&:last-child': {
        paddingRight: 10
      }
    },
    '& table': {
      width: '100%',
      borderCollapse: 'collapse'
    }
  },
  tableHeader: {
    background: ({ isHeaderGray }: StyleProps) => (isHeaderGray ? 'rgba(247, 247, 247, 1)' : 'transparent'),
    borderRadius: ({ isHeaderGray }: StyleProps) => (isHeaderGray ? 14 : 0),
    overflow: 'hidden',
    '& .MuiTableCell-root': {
      padding: '15px 15px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#000000',
      borderBottom: ({ isHeaderGray }: StyleProps) => (isHeaderGray ? 'none' : '1px solid #000000'),
      '&:first-child': {
        paddingLeft: 10
      },
      '&:last-child': {
        paddingRight: 10
      }
    }
  },
  tableRow: {
    borderBottom: ({ isHeaderGray }: StyleProps) =>
      isHeaderGray ? '1px solid rgba(247, 247, 247, 1)' : '1px solid #999999',
    height: 50,
    '&:hover': {
      backgroundColor: ' rgba(178, 243, 85, 0.08)'
    },
    '&:last-child': {
      border: 'none'
    }
  }
})

export function BaseTable({
  header,
  rows,
  isHeaderGray
}: {
  header: string[]
  rows: (string | number | JSX.Element)[][]
  isHeaderGray?: boolean
}) {
  const classes = useStyles({ isHeaderGray })
  return (
    <TableContainer className={classes.root}>
      <Table stickyHeader={true} aria-label="sticky table">
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
      </Table>
    </TableContainer>
  )
}

export default function TransactionsTable({
  transactionRecords
}: {
  transactionRecords: NFTTransactionRecordsProps[] | undefined
}) {
  const header = ['address', 'buy/sell', 'amount', 'ETHPrice']
  const rows: (string | number | JSX.Element)[][] = useMemo(() => {
    if (!transactionRecords) return []
    return transactionRecords.map(({ nftAmount, type, sender, totalSpend }) => {
      return [shortenAddress(sender), type, nftAmount, totalSpend]
    })
  }, [transactionRecords])

  return <BaseTable header={header} rows={rows} isHeaderGray />
}

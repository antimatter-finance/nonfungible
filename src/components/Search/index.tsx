import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { RowFixed } from 'components/Row'
import NFTButtonSelect from 'components/Button/NFTButtonSelect'
import { ButtonEmpty, ButtonOutlinedPrimary, ButtonPrimary } from 'components/Button'
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg'
import { TextValueInput } from 'components/TextInput'
import useMediaWidth from 'hooks/useMediaWidth'
import { CloseIcon, TYPE } from 'theme'

const SearchParams = [
  {
    id: 'indexName',
    option: 'Index Name'
  },
  {
    id: 'indexId',
    option: 'Index ID'
  },
  {
    id: 'createName',
    option: 'Creator name'
  }
  // {
  //   id: 'creatorName',
  //   option: 'Creator Name'
  // },
  // {
  //   id: 'creatorAddress',
  //   option: 'Creator Address'
  // }
]

const WrapperSearch = styled.div``

const StyledSearch = styled.div`
  margin: auto;
  padding-bottom: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  & > div {
    flex-shrink: 1;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-wrap: wrap
    flex-direction: column
    width: 100%;
    grid-gap:8px;
  `}
`

const ButtonWrapper = styled(RowFixed)`
  margin-left: 32px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
  margin-left: 10px;`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-left: 0;
  flex-direction: column
  width: 100%;
  button{
    width: 100%;
    :first-child{
      margin-bottom: 8px
    }
  }
`};
`

const MobileSearchWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: ${({ theme }) => theme.mobileHeaderHeight} 24px 24px
  width: 100%;
  background-color: ${({ theme }) => theme.bg2};
  z-index: 12;
  height: 100vh;
`

const MobileSearchButton = styled(ButtonEmpty)`
  position: fixed;
  top: 4px;
  z-index: 11;
  right: 72px;
  width: fit-content;
  height: auto;
  svg {
    z-index: 11;
  }
`

const MobileCloseIcon = styled(CloseIcon)`
  position: absolute;
  top: 32px;
  right: 25px;
`

export default function Search({
  onSearch,
  isMobile
}: {
  onSearch: (searchParam: string, searchBy: string) => void
  isMobile?: boolean
}) {
  const [searchParam, setSearchParam] = useState('')
  const [searchBy, setSearchBy] = useState('')
  const match = useMediaWidth('upToMedium')
  const matchLg = useMediaWidth('upToLarge')

  const handleSearch = useCallback(() => {
    onSearch(searchParam, searchBy)
  }, [onSearch, searchBy, searchParam])

  const handleClear = useCallback(() => {
    setSearchParam('')
    setSearchBy('')
    onSearch('', '')
  }, [onSearch])

  return (
    <>
      <WrapperSearch>
        <StyledSearch>
          <NFTButtonSelect
            backgroundColor={isMobile ? '#ffffff' : undefined}
            onSelection={id => {
              setSearchParam(id)
            }}
            width={match ? '100%' : '240px'}
            minWidth={'220px'}
            options={SearchParams}
            selectedId={searchParam}
            placeholder="Select search parameter"
            marginRight={match ? '0' : '10px'}
          />{' '}
          <TextValueInput
            backgroundColor={isMobile ? '#ffffff' : undefined}
            value={searchBy}
            onUserInput={val => {
              setSearchBy(val)
            }}
            placeholder="Search by"
            height="3rem"
            width="100%"
            maxWidth={match ? 'unset' : matchLg ? '400px' : '552px'}
          />
          <ButtonWrapper>
            <ButtonPrimary width="152px" onClick={handleSearch}>
              <SearchIcon style={{ marginRight: 10 }} />
              Search
            </ButtonPrimary>
            <div style={{ width: 10 }} />
            <ButtonOutlinedPrimary width="152px" onClick={handleClear} style={{ whiteSpace: 'nowrap' }}>
              Show All
            </ButtonOutlinedPrimary>
          </ButtonWrapper>
        </StyledSearch>
      </WrapperSearch>
    </>
  )
}

export function MobileSearch({ onSearch }: { onSearch: (searchParam: string, searchBy: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const match = useMediaWidth('upToSmall')

  useEffect(() => {
    if (!match) {
      setIsOpen(false)
    }
  }, [match])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      <MobileSearchButton onClick={handleOpen} id="mobileSearch">
        <SearchIcon style={{ fill: '#252525', height: 30 }} />
      </MobileSearchButton>
      {isOpen && (
        <MobileSearchWrapper>
          <MobileCloseIcon onClick={handleClose} />
          {/* <ButtonEmpty onClick={handleClose}>
            <X size={24} />
          </ButtonEmpty> */}
          <TYPE.body fontSize={28} fontWeight={700} style={{ marginBottom: 20 }}>
            Search a spot index
          </TYPE.body>
          <Search onSearch={onSearch} isMobile />
        </MobileSearchWrapper>
      )}
    </>
  )
}

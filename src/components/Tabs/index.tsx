import styled from 'styled-components'
import { RowFixed } from '../Row'
import { ButtonEmpty } from '../Button'

const StyledTabs = styled(RowFixed)`
  margin-bottom: 20px;
`

const StyledTabItem = styled(ButtonEmpty)<{ current?: string | boolean }>`
  color: ${({ theme, current }) => (current ? theme.text1 : theme.text3)};
  width: auto;
  font-family: SF Pro;
  font-weight: bold;
  margin-right: 32px;
  border-radius: 0;
  padding: 14px 0 8px;
  border-bottom: ${({ theme, current }) => `2px solid ${current ? theme.text1 : 'transparent'}`};
  &:hover {
    color: ${({ theme, current }) => (current ? theme.text1 : theme.text2)};
  }
  &:active {
    color: ${({ theme }) => theme.text2};
  }
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin-right: 14px;
  font-size: 14px;
  `}
`
export { StyledTabItem, StyledTabs }

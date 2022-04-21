import styled from 'styled-components'

export const SwitchTabWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.text1 + '10'};
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    overflow-x: auto;
    overflow-y: hidden;
    `};
`

export const Tab = styled.button<{ selected: boolean }>`
  border: none;
  background: none;
  padding: 14px 0;
  margin-right: 40px;
  font-size: 16px;
  font-weight: 700;
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.text3)};
  border-bottom: 3px solid ${({ selected, theme }) => (selected ? theme.text1 : 'transparent')};
  margin-bottom: -1px;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.text2};
  }
`

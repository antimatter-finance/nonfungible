import React, { useMemo, useRef, useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { ButtonProps } from 'rebass/styled-components'
import { ButtonOutlined, Base } from '.'
import { RowBetween, AutoRow } from '../Row'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { TYPE } from '../../theme'
import useTheme from '../../hooks/useTheme'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ReactComponent as Check } from 'assets/svg/black_check.svg'

export const StyledDropDown = styled(DropDown)<{
  selected?: boolean
}>`
  margin: 0 11px 0 0;
  width: 17px;
  height: 17px;

  transform: ${({ selected }) => (selected ? 'rotate(180deg)' : 'none')};
  transition: ${({ selected }) => (selected ? 'transform 0.1s linear' : 'transform 0.1s linear')};
  path {
    stroke-width: 1.5px;
    stroke: ${({ theme }) => theme.text1};
  }
`

const ButtonWrapper = styled.div<{ width: string; marginRight: string; minWidth?: string }>`
  width: ${({ width }) => (width ? width : '100%')};
  position: relative;
  flex: 1 0;
  margin-right: ${({ marginRight }) => marginRight ?? 0};
  min-width: ${({ minWidth }) => minWidth};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin-right:0;
  `};
`

export const ButtonSelectStyle = styled(ButtonOutlined)<{
  selected?: boolean
  width?: string
  backgroundColor?: string
}>`
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 400;
  height: 3rem;
  background-color: ${({ theme, backgroundColor }) => backgroundColor ?? theme.bg2};
  color: ${({ theme, selected }) => (selected ? theme.text1 : theme.text2)};
  border-radius: 10px;
  border: unset;
  padding: 0 10px 0 15px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  :focus,
  :active {
    border: 1px solid ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
    box-shadow: none;
  }
  :hover {
    border: 1px solid ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.bg1))};
    box-shadow: none;
  }
  &:disabled {
    :hover {
      border-color: transparent;
    }
    opacity: 100%;
    cursor: auto;
    color: ${({ theme }) => theme.text2};
  }
`
const OptionWrapper = styled.div<{ isOpen: boolean; width?: string }>`
  position: absolute;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  width: ${({ width }) => width ?? '100%'};
  border-radius: 14px;
  overflow: hidden;
  z-index: 10;
  margin-top: 4px;
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid #ededed;
`
const SelectOption = styled(Base)<{ selected: boolean }>`
  border: none;
  font-weight: 400;
  border-radius: unset;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
  padding: 14px;
  justify-content: space-between;
  border-bottom: 1px solid #ededed;
  :hover,
  :focus,
  :active {
    background-color: ${({ theme }) => theme.primary2};
  }
  :last-child {
    border-bottom: none;
  }
`

export default function ButtonSelect({
  children,
  label,
  options,
  onSelection,
  selectedId,
  onClick,
  width = '100%',
  disabled,
  placeholder = 'Select Option Type',
  marginRight = '20px',
  minWidth,
  backgroundColor
}: ButtonProps & {
  disabled?: boolean
  label?: string
  onSelection?: (id: string) => void
  options?: { id: string; option: string | JSX.Element }[]
  selectedId?: string
  onClick?: () => void
  placeholder?: string
  width?: string
  marginRight?: string
  minWidth?: string
  backgroundColor?: string
}) {
  const node = useRef<HTMLDivElement>()
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside(node, () => setIsOpen(false))
  const buttonContent = useMemo(() => {
    if (options) {
      if (options.length > 0) {
        const selected = options.find(({ id }) => id === selectedId)
        return selected ? selected.option : placeholder
      }
      return placeholder
    }
    return children
  }, [options, children, selectedId, placeholder])
  const handleClick = useCallback(() => {
    setIsOpen(!isOpen)
    onClick && onClick()
  }, [isOpen, onClick])
  return (
    <ButtonWrapper width={width} marginRight={marginRight} minWidth={minWidth}>
      {label && (
        <AutoRow style={{ marginBottom: '4px' }}>
          <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
            {label}
          </TYPE.body>
        </AutoRow>
      )}
      <ButtonSelectStyle
        onClick={handleClick}
        selected={!!selectedId}
        disabled={disabled}
        backgroundColor={backgroundColor}
      >
        <RowBetween>
          <div style={{ display: 'flex', alignItems: 'center' }}>{buttonContent}</div>
          {!disabled && <StyledDropDown selected={isOpen} />}
        </RowBetween>
      </ButtonSelectStyle>
      {options && onSelection && (
        <OptionWrapper isOpen={isOpen} ref={node as any}>
          {options.map(({ id, option }) => {
            return (
              <SelectOption
                key={id}
                selected={selectedId === id}
                onClick={() => {
                  onSelection(id)
                  setIsOpen(false)
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 500 }}>{option}</div>
                {selectedId === id && <Check />}
              </SelectOption>
            )
          })}
        </OptionWrapper>
      )}
    </ButtonWrapper>
  )
}

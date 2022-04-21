import React from 'react'
import { X } from 'react-feather'
import { Text } from 'rebass'
import styled from 'styled-components'
import { ApplicationModal } from '../../state/application/actions'
import { useCloseModals, useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import { useUserTransactionTTL, useUserSlippageTolerance } from '../../state/user/hooks'
import Modal from '../Modal'
import TransactionSettings from './TransactionSettings'
import { ReactComponent as Settings } from '../../assets/svg/settings.svg'
import { Marginer } from 'pages/App'
import { Box } from '@mui/material'

const StyledMenuIcon = styled(Settings)`
  height: 16px;
  width: 16px;

  > * {
    fill: ${({ theme }) => theme.text3};
  }

  :hover {
    opacity: 0.7;
  }
`

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`

export const SLIPPAGE_TYPE = { generation: 'generation', redeem: 'redeem' }

export default function SettingsTab({ onlySlippage }: { onlySlippage?: boolean }) {
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const close = useCloseModals()
  const toggle = useToggleSettingsMenu()

  const userSlippage = useUserSlippageTolerance()
  const [currentSlippage, currentSlippageSetting] = userSlippage

  const [ttl, setTtl] = useUserTransactionTTL()

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    // <StyledMenu>
    <>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <Modal isOpen={open} onDismiss={close} maxWidth={500} width="100%">
          <Box
            gap="28px"
            style={{ padding: '30px 30px 48px', position: 'relative', width: '100%' }}
            display={'flex'}
            flexDirection="column"
            justifyContent={'flex-start'}
          >
            <StyledCloseIcon onClick={toggle} style={{ position: 'absolute', top: '26px', right: '30px' }} />
            <Text fontWeight={500} fontSize={28}>
              Transaction Settings
            </Text>
            <TransactionSettings
              rawSlippage={currentSlippage}
              setRawSlippage={currentSlippageSetting}
              deadline={ttl}
              setDeadline={setTtl}
              onlySlippage={onlySlippage}
            />
          </Box>
          <Marginer />
        </Modal>
      )}

      {/* </StyledMenu> */}
    </>
  )
}

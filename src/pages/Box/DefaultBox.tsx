import React from 'react'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { ButtonPrimary, Base } from 'components/Button'
import { OutlineCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { ApprovalState } from 'hooks/useApproveCallback'
import { useWalletModalToggle } from 'state/application/hooks'
import { Dots } from 'components/Dots'
import { JSBI, TokenAmount } from '@uniswap/sdk'
// import { TimerCapsule } from 'components/NFTCard/Capsule'

export default function DefaultBox({
  remainingNFT = true,
  participated,
  approval,
  drawDepositAmount,
  onApprove,
  onDraw,
  account,
  matterBalance
}: {
  remainingNFT: any
  participated: boolean
  drawDepositAmount: string
  approval: ApprovalState
  onApprove: () => void
  onDraw: () => void
  account: string | null | undefined
  matterBalance: TokenAmount | undefined
}) {
  const toggleWalletModal = useWalletModalToggle()
  return (
    <AutoColumn gap="46px">
      <div>
        <RowBetween style={{ marginBottom: 8 }}>
          <TYPE.black fontWeight={700} fontSize={30} className="title">
            Antimatter NFT
          </TYPE.black>
          <TYPE.black fontWeight={400} fontSize={24} className="phase">
            Phase #1
          </TYPE.black>
        </RowBetween>
        {/* <TimerCapsule timeLeft={1630877914} /> */}
      </div>
      <div>
        <OutlineCard color="#dddddd">
          <RowBetween>
            <TYPE.black fontWeight={400}>Amount per Box</TYPE.black>
            <TYPE.black fontWeight={400}>{drawDepositAmount ?? '--'} MATTER</TYPE.black>
          </RowBetween>
        </OutlineCard>
        <TYPE.smallGray marginTop="8px">1 box for 1 contract address</TYPE.smallGray>
        <TYPE.body color="#000" style={{ margin: '20px 0 -30px' }}>
          Note: Your deposit will be staked in the NFT for 4 months and become claimable after.{' '}
        </TYPE.body>
      </div>
      {!account ? (
        <ButtonPrimary onClick={toggleWalletModal}>Connect</ButtonPrimary>
      ) : !remainingNFT ? (
        <Base disabled backgroundColor="#aaaaaa">
          Closed
        </Base>
      ) : participated ? (
        <Base disabled backgroundColor="#aaaaaa">
          You already have nft
        </Base>
      ) : matterBalance?.lessThan(JSBI.BigInt(drawDepositAmount)) ? (
        <ButtonPrimary disabled>Insufficient MATTER Balance</ButtonPrimary>
      ) : approval === ApprovalState.APPROVED ? (
        <ButtonPrimary onClick={onDraw}>Buy</ButtonPrimary>
      ) : approval === ApprovalState.PENDING ? (
        <ButtonPrimary disabled>
          Approve
          <Dots />
        </ButtonPrimary>
      ) : approval === ApprovalState.UNKNOWN ? (
        <ButtonPrimary disabled>
          Loading
          <Dots />
        </ButtonPrimary>
      ) : (
        <ButtonPrimary onClick={onApprove}>Approve</ButtonPrimary>
      )}
    </AutoColumn>
  )
}

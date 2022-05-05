import React, { useState, useMemo, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { AutoColumn } from 'components/Column'
import { SwitchTabWrapper, Tab } from 'components/SwitchTab'
import DefaultBox from './DefaultBox'
import { RowFixed } from 'components/Row'
import { useBlindBox, useBlindBoxClaimed, useMyBlindBox } from 'hooks/useBlindBox'
import { useActiveWeb3React } from 'hooks/index'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { JSBI, Token, TokenAmount } from '@uniswap/sdk'
import { BLIND_BOX_ADDRESS, MATTER_ADDRESS } from 'constants/index'
import { tryParseAmount } from 'utils/tryParseAmount'
import WaitingModal from './WaitingModal'
import { Dots } from 'components/Dots'
import { useTransaction, useTransactionAdder } from 'state/transactions/hooks'
import { useHistory } from 'react-router'
import { useBlindBoxContract } from 'hooks/useContract'
import { useTokenBalance } from 'state/wallet/hooks'
import { useCurrentUserInfo, useLogin } from 'state/userInfo/hooks'
import { ButtonPrimary } from 'components/Button'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import AnimatedSvg from 'components/AnimatedSvg'
import { Box as MuiBox } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'

const Wrapper = styled.div`
  width: 100%;
  color: #000000;
  margin-top: 60px;
  min-height: ${({ theme }) => `calc(100vh - ${theme.headerHeight})`};

  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 40px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
  margin-top: 0;
  background-position: -100px bottom;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 24px
  `};
`

const AppBody = styled.div`
  max-width: 520px;
  width: 100%;
  margin-bottom: 100px;
  padding: 40px;
  background: #ffffff;
  border-radius: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-bottom: 52px;
  padding: 24px 20px;
  .title{
    font-size: 24px;
  };
  .phase{
    font-size: 16px
  }
  `}
`

const FormWrapper = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxContentWidth};
  display: flex;
  justify-content: space-between;
  margin-top: 80px;
  align-items: center;
  gap: 100px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    gap: 40px;
    justify-content: center;
    flex-direction: column;
    margin-bottom: auto;
    margin-top: 24px;
  `};
`

const CardWrapper = styled(AutoColumn)`
  width: 100%;
  max-width: ${({ theme }) => theme.maxContentWidth};
  background: #ffffff;
  border-radius: 30px;
  padding: 32px;
`

const CardGrid = styled.div`
  margin-top: 60px;
  width: 100%;
  display: grid;
  grid-gap: 28px;
  row-gap: 32px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  grid-template-columns: 1fr 1fr 1fr;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  grid-gap: 16px;
  grid-template-columns: 1fr 1fr;
  `}
`

const CardImgWrapper = styled(AutoColumn)`
  grid-gap: 8px;
  span:first-child {
    color: ${({ theme }) => theme.text1}
    font-size: 20px;
  }
  span:last-child {
    color: ${({ theme }) => theme.text3};
    font-size: 14px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  span:first-child {  font-size: 16px;}
  span:last-child { font-size: 12px;}
   `}
`

const CardImg = styled.img`
  border-radius: 30px;
  width: 100%;
  height: auto;
`

const generateImages = (onLastLoad: () => void) => {
  const arr = []
  let i = 0
  while (i <= 65) {
    arr.push(
      <CardImgWrapper key={i}>
        <CardImg src={`/images/doll/${65 - i}.png`} onLoad={i === 65 ? onLastLoad : undefined} alt={''} />
        <RowFixed>
          <span>#{i + 1}&nbsp;</span>
          <span>/66</span>
        </RowFixed>
      </CardImgWrapper>
    )
    i++
  }

  return arr
}

export default function Box() {
  const { account, chainId } = useActiveWeb3React()
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [hash, setHash] = useState('')
  const [imgLoaded, setImgLoaded] = useState(false)
  const { remainingNFT, participated, drawDeposit, claimAt } = useBlindBox(account)
  const drawDepositAmount = MATTER_ADDRESS[chainId || 1]
    ? new TokenAmount(new Token(chainId || 1, MATTER_ADDRESS[chainId || 1], 18), JSBI.BigInt(drawDeposit || 0))
    : undefined

  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [attemptingTxnModal, setAttemptingTxnModal] = useState(false)
  const [modalHash, setModalHash] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { ret: myMlindBoxData } = useMyBlindBox()
  const blindBoxClaimed = useBlindBoxClaimed(myMlindBoxData.length ? myMlindBoxData[0].id : undefined)
  const matterBalance = useTokenBalance(
    account || undefined,
    MATTER_ADDRESS[chainId || 1] ? new Token(chainId || 1, MATTER_ADDRESS[chainId || 1], 18) : undefined
  )
  const isDownSm = useBreakpoint('sm')
  const history = useHistory()
  const addTxn = useTransactionAdder()
  const txn = useTransaction(hash)

  useEffect(() => {
    txn && txn.receipt && txn.receipt.status === 1 && setAttemptingTxn(false)
  }, [txn])

  const handleLoad = useCallback(() => {
    setImgLoaded(true)
  }, [])

  const images = useMemo(() => generateImages(handleLoad), [handleLoad])

  const [approval, approveCallback] = useApproveCallback(
    tryParseAmount(
      drawDepositAmount?.toSignificant(),
      MATTER_ADDRESS[chainId || 1] ? new Token(chainId || 1, MATTER_ADDRESS[chainId || 1], 18) : undefined
    ),
    BLIND_BOX_ADDRESS[chainId || 1]
  )

  const handleApprove = useCallback(() => {
    approveCallback()
  }, [approveCallback])

  const contract = useBlindBoxContract()
  const handleDraw = useCallback(() => {
    setAttemptingTxn(true)

    contract &&
      contract
        .draw({
          from: account
        })
        .then((response: any) => {
          setHash(response.hash)
          addTxn(response, { summary: 'draw NFT' })
        })
        .catch((error: any) => {
          setAttemptingTxn(false)
          if (error?.code === 4001) {
            console.error('Transaction rejected.')
          } else {
            console.error(`Draw failed: ${error.message}`)
          }
        })
    return
  }, [account, addTxn, contract])

  const onWithdrawMatter = useCallback(() => {
    if (!account || !contract || !myMlindBoxData.length || !myMlindBoxData[0].id) return
    setTransactionModalOpen(true)
    setAttemptingTxnModal(true)
    contract
      .claim(myMlindBoxData[0].id, {
        from: account
      })
      .then((response: any) => {
        addTxn(response, { summary: 'claim Matter' })
        setAttemptingTxnModal(false)
        setModalHash(response.hash)
      })
      .catch((error: any) => {
        setAttemptingTxnModal(false)
        setError(true)
        setErrorMsg(error.error ? error.error.message : error.data ? error.data.message : error?.message)
        if (error?.code === 4001) {
          console.error('Transaction rejected.')
        } else {
          console.error(`claimMatter: ${error.message}`)
        }
      })
    return
  }, [account, addTxn, contract, myMlindBoxData])

  const userInfo = useCurrentUserInfo()
  const { login } = useLogin()

  const toShowUserPanel = useCallback(() => {
    if (userInfo && userInfo.token) {
      history.push('/profile/my_nfts')
      return
    } else login()
  }, [userInfo, login, history])

  return (
    <Wrapper>
      <TYPE.monument style={{ width: '100%', color: '#252525', fontSize: isDownSm ? 28 : 48 }} textAlign="center">
        Art meets Finance
      </TYPE.monument>
      <FormWrapper>
        <MuiBox mb={{ xs: 0, md: 100 }}>
          <AnimatedSvg fileName="collectables" />
        </MuiBox>
        <AppBody>
          {approval === ApprovalState.PENDING && (
            <WaitingModal
              title="Approve for spending limit"
              buttonText={
                <RowFixed>
                  Approving
                  <Dots />
                </RowFixed>
              }
            />
          )}
          {approval !== ApprovalState.PENDING && !attemptingTxn && !hash && !participated && (
            <DefaultBox
              remainingNFT={remainingNFT}
              participated={participated}
              drawDepositAmount={drawDepositAmount?.toSignificant() || ''}
              approval={approval}
              matterBalance={matterBalance}
              onApprove={handleApprove}
              onDraw={handleDraw}
              account={account}
            />
          )}
          {approval !== ApprovalState.PENDING && attemptingTxn && !hash && (
            <WaitingModal
              title="Please interact with your wallet and wait for purchase"
              buttonText={
                <RowFixed>
                  Waiting for confirmation
                  <Dots />
                </RowFixed>
              }
            />
          )}

          {attemptingTxn && hash && (
            <WaitingModal
              title="Transaction confirmation"
              buttonText={
                <RowFixed>
                  Confirmation...
                  <Dots />
                </RowFixed>
              }
            />
          )}

          {participated && !attemptingTxn && (
            <WaitingModal
              title="Congratulations!"
              subTitle="You have successfully mint an Antimatter Collectible"
              icon={
                <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                  <circle cx="34" cy="34" r="32" stroke="#B2F355" strokeWidth="4" />
                  <path d="M20 30L33 43L49 25" stroke="#B2F355" strokeWidth="4" />
                </svg>
              }
              buttonText="Check My NFTs"
              onClick={toShowUserPanel}
              op={
                !blindBoxClaimed ? (
                  <>
                    <ButtonPrimary
                      onClick={onWithdrawMatter}
                      disabled={!claimAt || new Date(claimAt * 1000) > new Date()}
                    >
                      Claim Matter
                    </ButtonPrimary>
                    <span>Note: Claimable time is {claimAt ? new Date(claimAt * 1000).toUTCString() : '-'}.</span>
                  </>
                ) : (
                  <ButtonPrimary disabled={true}>Claimed</ButtonPrimary>
                )
              }
            />
          )}
        </AppBody>
      </FormWrapper>
      <CardWrapper>
        <SwitchTabWrapper>
          <Tab key={'live'} selected={true}>
            All Boxes
          </Tab>
        </SwitchTabWrapper>

        {!imgLoaded && (
          <MuiBox>
            <AnimatedSvg fileName="loader" />
          </MuiBox>
        )}
        <CardGrid style={{ display: imgLoaded ? 'inherit' : 'none' }}>{images}</CardGrid>
      </CardWrapper>

      <TransactionConfirmationModal
        isOpen={transactionModalOpen}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDismiss={() => {
          setError(false)
          setErrorMsg('')
          setTransactionModalOpen(false)
        }}
        hash={modalHash}
        attemptingTxn={attemptingTxnModal}
        error={error}
        errorMsg={errorMsg}
      />
    </Wrapper>
  )
}

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getContract, getContractWithSigner, getTokenContractWithSigner, formatUnits } from '../contracts'
import { CONFIG } from '../config'

interface Props {
  account: string | null
}

interface PoolData {
  round: number
  totalPool: string
  youBet: string
}

function PoolCard({ label, value, symbol, highlight = false }: { label: string; value: string; symbol: string; highlight?: boolean }) {
  return (
    <div className={`${highlight ? 'card-purple' : 'card'} flex-1 text-center`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">{label}</p>
      <p className={`display-hero ${highlight ? 'text-purple' : 'text-primary'} mb-1`}>
        {value}
      </p>
      <p className="text-sm text-muted font-medium">{symbol}</p>
    </div>
  )
}

export function PoolDisplay({ account }: Props) {
  const [data, setData] = useState<PoolData>({ round: 0, totalPool: '----', youBet: '----' })
  const [loading, setLoading] = useState(false)
  const [txStatus, setTxStatus] = useState<'idle' | 'approve' | 'approved' | 'bet' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function refresh() {
    try {
      const contract = getContract()
      const round = await contract.round()
      const roundNum = Number(round)

      const [totalPool, youBet] = await Promise.all([
        contract.totalPool(roundNum),
        account ? contract.personTotal(roundNum, account) : Promise.resolve(ethers.BigNumber.from(0)),
      ])

      setData({
        round: roundNum,
        totalPool: Number(formatUnits(totalPool)).toFixed(4),
        youBet: account ? Number(formatUnits(youBet)).toFixed(4) : '----',
      })
    } catch (err) {
      console.error('Failed to fetch pool data:', err)
    }
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 8000)
    return () => clearInterval(interval)
  }, [account])

  async function handleBet() {
    if (!account) return
    setLoading(true)
    setTxStatus('idle')
    setErrorMsg('')
    try {
      const contract = getContractWithSigner()
      const tokenContract = getTokenContractWithSigner()

      const tokenWei = await contract.tokenWei()
      const allowance = await tokenContract.allowance(account, CONFIG.contract)
      const minAmount = tokenWei

      if (allowance.lt(minAmount)) {
        setTxStatus('approve')
        const approveTx = await tokenContract.approve(CONFIG.contract, tokenWei.mul(10))
        await approveTx.wait()
        setTxStatus('approved')
      }

      setTxStatus('bet')
      const tx = await contract.bet(tokenWei)
      await tx.wait()
      setTxStatus('success')
      await refresh()
      setTimeout(() => setTxStatus('idle'), 3000)
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string; code?: string }
      setTxStatus('error')
      setErrorMsg(error.reason || error.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      {/* Pool cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PoolCard label="Round" value={`#${data.round}`} symbol="" />
        <PoolCard label="Total Prize Pool" value={data.totalPool} symbol={CONFIG.token.symbol} highlight />
        <PoolCard label="Your Bet" value={data.youBet} symbol={CONFIG.token.symbol} />
      </div>

      {/* Bet button */}
      <div className="text-center">
        {!account ? (
          <p className="text-sm text-muted mb-3">Connect wallet to participate</p>
        ) : (
          <div className="space-y-3">
            <button
              className="btn-primary text-base px-8 py-4"
              onClick={handleBet}
              disabled={loading || txStatus === 'bet' || txStatus === 'approve'}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="spinner" />
                  {txStatus === 'approve' ? 'Approving...' : txStatus === 'approved' ? 'Approved! ' : ''}
                  {txStatus === 'bet' ? 'Betting...' : ''}
                </span>
              ) : txStatus === 'success' ? (
                <span className="inline-flex items-center gap-2">
                  <span className="text-lg">✅</span> Success!
                </span>
              ) : (
                `Place Bet`
              )}
            </button>

            {txStatus === 'error' && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            {txStatus === 'idle' && (
              <p className="text-xs text-muted">
                Prize pool: 92% to winner · 8% fee · Ends every 24h
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
import { useState } from 'react'
import { ethers } from 'ethers'
import { connectWallet, switchChain, minAccount, CONFIG } from '../contracts'

interface Props {
  onConnect: (account: string) => void
}

export function WalletButton({ onConnect }: Props) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'wrong-chain' | 'connected'>('idle')
  const [account, setAccount] = useState<string | null>(null)

  const ethRef = (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum

  async function handleClick() {
    const eth = ethRef
    if (!eth) {
      alert('Please install MetaMask!')
      return
    }

    setStatus('connecting')
    try {
      const accounts = await connectWallet()
      const chainId = await eth.request({ method: 'eth_chainId' }) as string

      if (chainId !== CONFIG.chain) {
        try {
          await switchChain(CONFIG.chain)
        } catch {
          setStatus('wrong-chain')
          return
        }
      }

      setAccount(accounts[0])
      setStatus('connected')
      onConnect(accounts[0])
    } catch (err) {
      console.error(err)
      setStatus('idle')
    }
  }

  if (status === 'connected' && account) {
    return (
      <button className="btn-secondary text-sm" onClick={handleClick}>
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {minAccount(account)}
        </span>
      </button>
    )
  }

  return (
    <button
      className="btn-primary text-sm"
      onClick={handleClick}
      disabled={status === 'connecting'}
    >
      {status === 'connecting' ? (
        <span className="inline-flex items-center gap-2">
          <span className="spinner !border-[#7132f5] !border-t-transparent" />
          Connecting...
        </span>
      ) : status === 'wrong-chain' ? (
        'Switch Network'
      ) : (
        'Connect Wallet'
      )}
    </button>
  )
}
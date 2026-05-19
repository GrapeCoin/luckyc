import { useState, useEffect } from 'react'
import { connectWallet, switchChain, minAccount, CONFIG } from '../contracts'

interface Props {
  onConnect: (account: string) => void
}

export function WalletButton({ onConnect }: Props) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'wrong-chain' | 'connected'>('idle')
  const [account, setAccount] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const getEth = () => (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum

  // Watch for account/chain changes
  useEffect(() => {
    const eth = (window as unknown as { ethereum?: { on: (event: string, handler: (...args: unknown[]) => void) => void; removeListener: (event: string, handler: (...args: unknown[]) => void) => void } }).ethereum
    if (!eth) return
    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[]
      if (accs.length === 0) {
        setAccount(null)
        setStatus('idle')
        onConnect('' as unknown as string)
      } else if (status === 'connected' && accs[0] !== account) {
        setAccount(accs[0])
        onConnect(accs[0])
      }
    }
    const handleChainChanged = () => {
      // Reload page on chain change (recommended by MetaMask)
      window.location.reload()
    }
    eth.on('accountsChanged', handleAccountsChanged)
    eth.on('chainChanged', handleChainChanged)
    return () => {
      eth.removeListener?.('accountsChanged', handleAccountsChanged)
      eth.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [])

  async function handleClick() {
    const eth = getEth()
    if (!eth) {
      alert('Please install MetaMask!')
      return
    }

    setErrorMsg(null)
    setStatus('connecting')
    try {
      const accounts = await connectWallet()
      const chainId = await eth.request({ method: 'eth_chainId' }) as string

      if (chainId !== CONFIG.chain) {
        try {
          await switchChain(CONFIG.chain)
        } catch (err: unknown) {
          const error = err as { code?: number; message?: string }
          // User rejected or network not found
          if (error.code === 4001 || error.message?.includes('rejected')) {
            setErrorMsg('User rejected network switch')
          } else {
            setErrorMsg(error.message || 'Failed to switch network')
          }
          setStatus('wrong-chain')
          return
        }
      }

      setAccount(accounts[0])
      setStatus('connected')
      onConnect(accounts[0])
    } catch (err: unknown) {
      console.error(err)
      const error = err as { code?: number; message?: string }
      if (error.code === 4001) {
        setErrorMsg('User rejected wallet connection')
      } else {
        setErrorMsg(error.message || 'Failed to connect wallet')
      }
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
    <div className="flex flex-col items-end gap-1">
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
      {errorMsg && (
        <span className="text-xs text-red-500">{errorMsg}</span>
      )}
    </div>
  )
}
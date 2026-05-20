import { useState } from 'react'
import { WalletButton } from './components/WalletButton'
import { PoolDisplay } from './components/PoolDisplay'
import { HistoryTable } from './components/HistoryTable'
import { GeoChecker, BanDialog } from './components/GeoChecker'
import { CONFIG } from './contracts'

function App() {
  const [account, setAccount] = useState<string | null>(null)
  const [banned, setBanned] = useState(false)

  const contractUrl = CONFIG.scan.replace('{address}', CONFIG.contract)

  function handleBanned(isBanned: boolean) {
    setBanned(isBanned)
  }

  async function handleAddToWallet() {
    const eth = (window as unknown as { ethereum?: { request: (args: { method: string; params: unknown }) => Promise<boolean> } }).ethereum
    if (!eth) return
    try {
      await eth.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: CONFIG.token,
        },
      })
    } catch (err) {
      console.error('Failed to add token:', err)
    }
  }

  return (
    <>
      <GeoChecker onBanned={handleBanned} />
      <BanDialog open={banned} />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#dedee5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg shadow-purple/30">
                L
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg text-primary tracking-tight">LuckyC Number</span>
                <span className="text-xs text-muted -mt-0.5">{CONFIG.chainName}</span>
              </div>
            </a>

            {/* Right nav */}
            <div className="flex items-center gap-4">
              <span className="badge-neutral hidden sm:inline-flex">
                {CONFIG.token.symbol} only
              </span>
              <WalletButton onConnect={setAccount} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-subtle border border-purple/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-purple">Live on {CONFIG.chainName}</span>
          </div>

          {/* Headline */}
          <h1 className="display-hero text-primary max-w-2xl mx-auto">
            One Winner.
            <br />
            <span className="text-purple">92%</span> of the Prize Pool.
          </h1>

          {/* Subheadline */}
          <p className="body-text max-w-xl mx-auto text-base">
            Every 24 hours, one lucky participant wins 92% of the total prize pool.
            The more you bet, the higher your winning probability.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              className="btn-primary text-base px-6 py-3"
              onClick={() => document.getElementById('pool-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Participate Now
            </button>
            <button className="btn-outline text-base px-6 py-3" onClick={handleAddToWallet}>
              + Add {CONFIG.token.symbol} to Wallet
            </button>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section className="bg-[#f9f9fb] border-y border-[#dedee5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="section-heading text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Connect Wallet',
                desc: 'Connect your MetaMask wallet. Make sure you have ' + CONFIG.token.symbol + ' on ' + CONFIG.chainName + '.',
                icon: '👛',
              },
              {
                num: '02',
                title: 'Place Your Bet',
                desc: 'Click Bet to participate in the current round. Each bet costs exactly 1 ' + CONFIG.token.symbol + '.',
                icon: '🎰',
              },
              {
                num: '03',
                title: 'Wait for Draw',
                desc: 'One round ends every 24 hours. The winner is determined by a provably fair algorithm.',
                icon: '🏆',
              },
            ].map((step) => (
              <div key={step.num} className="card text-center space-y-4">
                <div className="text-4xl">{step.icon}</div>
                <div>
                  <span className="text-xs font-bold text-purple uppercase tracking-wider">{step.num}</span>
                  <h3 className="feature-title text-primary mt-1">{step.title}</h3>
                </div>
                <p className="body-text text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pool Display */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16" id="pool-section">
        <PoolDisplay account={account} />
        <HistoryTable />
      </main>

      {/* Footer */}
      <footer className="bg-[#101114] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple flex items-center justify-center text-white font-bold text-sm">
                  L
                </div>
                <span className="font-bold">LuckyC Number</span>
              </div>
              <p className="text-sm text-gray-400">
                A decentralized lottery DApp. Every round is transparent and verifiable on-chain.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">Contract</h4>
              <a
                href={contractUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-purple hover:text-purple-dark transition-colors"
              >
                View on {CONFIG.scan.includes('bscscan') ? 'BscScan' : 'Etherscan'}
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">Connect</h4>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/LuckyCNumber"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="https://t.me/LuckyCNumber"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © 2024 LuckyC Number. 92% prize pool · 8% fee. Fair, transparent, on-chain.
            </p>
            <p className="text-xs text-gray-600">
              Calculation: <code className="text-gray-500">(block.number + block.timestamp) % Total lucky numbers</code>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
import { useState, useEffect } from 'react'
import { getContract, formatUnits } from '../contracts'

interface HistoryEntry {
  round: number
  totalPool: string
  luckyNumber: number
  winner: string
}

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function WinnerBadge() {
  return (
    <span className="badge-success inline-flex items-center gap-1">
      <span>🏆</span> Winner
    </span>
  )
}

export function HistoryTable() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const contract = getContract()
        const round = await contract.round()
        const roundNum = Number(round)
        const entries: HistoryEntry[] = []

        for (let i = 1; i < roundNum; i++) {
          try {
            const [pool, winnerInfo] = await Promise.all([
              contract.totalPool(i),
              contract.getWinnerInfo(i, 0).catch(() => null),
            ])

            if (winnerInfo) {
              const [winner, , , luckyNumber] = winnerInfo
              entries.push({
                round: i,
                totalPool: Number(formatUnits(pool)).toFixed(4),
                luckyNumber: Number(luckyNumber),
                winner: winner,
              })
            }
          } catch {
            // Round may not have ended yet
          }
        }

        setHistory(entries.reverse())
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="card text-center py-8">
        <div className="inline-block w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-muted text-sm mt-3">Loading history...</p>
      </div>
    )
  }

  const displayHistory = expanded ? history : history.slice(0, 5)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-heading">Round History</h2>
        {history.length > 5 && (
          <button className="btn-outline text-sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show Less' : `Show All (${history.length})`}
          </button>
        )}
      </div>

      <div className="card !p-0 overflow-hidden">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🎰</p>
            <p className="text-muted">No completed rounds yet</p>
            <p className="text-xs text-muted mt-1">Be the first to participate!</p>
          </div>
        ) : (
          <table className="kraken-table">
            <thead>
              <tr>
                <th>Round</th>
                <th>Prize Pool</th>
                <th>Lucky Number</th>
                <th>Winner</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displayHistory.map((entry) => (
                <tr key={entry.round}>
                  <td>
                    <span className="font-semibold text-primary">#{entry.round}</span>
                  </td>
                  <td>
                    <span className="text-purple-dark font-semibold">{entry.totalPool}</span>
                  </td>
                  <td>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-subtle text-purple font-bold text-sm">
                      {entry.luckyNumber}
                    </span>
                  </td>
                  <td>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{truncate(entry.winner)}</code>
                  </td>
                  <td>
                    <WinnerBadge />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
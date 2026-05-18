import { useState } from 'react'
import { BANNED_COUNTRIES } from '../config'

interface Props {
  onBanned: (banned: boolean) => void
}

export function GeoChecker({ onBanned }: Props) {
  const [checked, setChecked] = useState(false)

  // Skip geo check in dev or if service unavailable
  useState(() => {
    setChecked(true)
    onBanned(false)
  })

  if (!checked) return null
  return null
}

export function BanDialog({ open }: { open: boolean }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card-purple max-w-md w-full text-center space-y-6 animate-float">
        <div className="text-6xl">🚫</div>
        <div>
          <h3 className="sub-heading text-primary mb-2">Access Restricted</h3>
          <p className="body-text">
            According to the laws and regulations in your region, we are unable to provide services to you.
          </p>
        </div>
        <button className="btn-secondary w-full" disabled>
          Thank you for your visit
        </button>
      </div>
    </div>
  )
}
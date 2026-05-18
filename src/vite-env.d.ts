/// <reference types="vite/client" />

interface Window {
  geoip2: {
    country: (callback: (response: { country: { iso_code: string } }) => void) => void
  }
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    on: (event: string, callback: (...args: unknown[]) => void) => void
    removeListener: (event: string, callback: (...args: unknown[]) => void) => void
    isMetaMask?: boolean
  }
}
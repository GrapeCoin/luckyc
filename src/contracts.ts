import { ethers } from 'ethers'
import { CONFIG, CURRENT_ENV } from './config'
import { LUCKY_CONTRACT_ABI, ERC20_ABI } from './abi'

function getEthereum() {
  return (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum
}

// Lazy getter so we don't crash on load when no wallet is present
let _provider: ethers.providers.Web3Provider | null = null

export function getProvider() {
  const eth = getEthereum()
  if (!eth) throw new Error('No ethereum provider')
  if (!_provider) _provider = new ethers.providers.Web3Provider(eth)
  return _provider
}

// ❌ 移除 eager export:
// export const provider = getProvider()

// ✅ 调用时实时获取

export async function connectWallet(): Promise<string[]> {
  const eth = getEthereum()
  if (!eth) throw new Error('No ethereum provider')
  return (await eth.request({ method: 'eth_requestAccounts' })) as string[]
}

export async function switchChain(chainId: string): Promise<void> {
  const eth = getEthereum()
  if (!eth) throw new Error('No ethereum provider')
  const result = await eth.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }],
  })
  if (result === undefined) return
}

export function getSigner() {
  return getProvider().getSigner()
}

export function getContract() {
  return new ethers.Contract(CONFIG.contract, LUCKY_CONTRACT_ABI, getProvider())
}

export function getContractWithSigner() {
  return new ethers.Contract(CONFIG.contract, LUCKY_CONTRACT_ABI, getSigner())
}

export function getTokenContract() {
  return new ethers.Contract(CONFIG.token.address, ERC20_ABI, getProvider())
}

export function getTokenContractWithSigner() {
  return new ethers.Contract(CONFIG.token.address, ERC20_ABI, getSigner())
}

// ethers v5 BigInt compat
export function toBigInt(val: ethers.BigNumber): bigint {
  return BigInt(val.toString())
}

export function formatUnits(value: ethers.BigNumber, decimals: number = 18): string {
  return ethers.utils.formatUnits(value, decimals)
}

export function parseUnits(value: string, decimals: number = 18): bigint {
  return ethers.utils.parseUnits(value, decimals).toBigInt()
}

export function minAccount(account: string): string {
  if (!account || account.length < 10) return account
  return `${account.slice(0, 5)}...${account.slice(-4)}`
}

export { CONFIG, CURRENT_ENV }
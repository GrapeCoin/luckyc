# LuckyC Number

A React-based decentralized lottery DApp built on BNB Chain / Goerli Testnet.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **ethers.js v5** (Ethereum interaction)
- **Tailwind CSS** + **PicoCSS** (styling)

## Features

- MetaMask wallet connection
- Auto network switching (BNB Chain / Goerli)
- Real-time prize pool display
- One-click bet with ERC20 approval flow
- Historical round results table
- Add token to wallet
- Geographic restriction check

## Development

```bash
npm install
npm run dev
```

## Environment

The app connects to **Goerli Testnet** by default. Edit `src/config.ts` to switch to:

- `prod` — BNB Smart Chain Mainnet
- `test` — BNB Smart Chain Testnet
- `goerli` — Goerli Testnet (default)

## Contract

- LuckyContract: `0xaBf48ce840F8D56ec2B38D84f44D3C78a281E042` (Goerli)
- LuckyToken: `0x9d5F930A7E3CBa1b3C1e26B4942fB85036856BfD` (Goerli)

## License

MIT
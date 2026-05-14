import { http, createConfig } from "wagmi"
import { mainnet, polygon, base } from "wagmi/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.warn("WalletConnect Project ID not found. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID")
}

// Alchemy API key for RPC endpoints
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""

export const config = getDefaultConfig({
  appName: "0xagent",
  projectId: projectId || "demo",
  chains: [mainnet, polygon, base],
  transports: {
    [mainnet.id]: http(
      alchemyKey 
        ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
        : undefined
    ),
    [polygon.id]: http(
      alchemyKey 
        ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`
        : undefined
    ),
    [base.id]: http(
      alchemyKey 
        ? `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`
        : undefined
    ),
  },
  ssr: true,
})

export const supportedChainIds = [mainnet.id, polygon.id, base.id] as const

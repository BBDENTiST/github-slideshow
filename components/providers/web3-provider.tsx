"use client"

import { useState, useEffect, type ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/wagmi-config"

import "@rainbow-me/rainbowkit/styles.css"

const queryClient = new QueryClient()

// Custom RainbowKit theme matching our cyber aesthetic
const customDarkTheme = darkTheme({
  accentColor: "#00D1FF",
  accentColorForeground: "#0a0a0f",
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
})

// Override additional theme properties
customDarkTheme.colors.connectButtonBackground = "rgba(255, 255, 255, 0.05)"
customDarkTheme.colors.connectButtonBackgroundError = "#ef4444"
customDarkTheme.colors.connectButtonInnerBackground = "rgba(0, 209, 255, 0.1)"
customDarkTheme.colors.modalBackground = "#0a0a0f"
customDarkTheme.colors.modalBorder = "rgba(0, 209, 255, 0.2)"

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={customDarkTheme}
          modalSize="compact"
        >
          {mounted ? children : null}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

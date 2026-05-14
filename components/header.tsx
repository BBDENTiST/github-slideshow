"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useBalance, useChainId } from "wagmi"
import { CHAIN_INFO } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"

export function Header() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const chainInfo = CHAIN_INFO[chainId]

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 glow-primary-sm">
            <Zap className="size-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-lg font-bold tracking-tight text-foreground">
              0x<span className="text-primary text-glow-primary">agent</span>
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Wallet Cleaner
            </span>
          </div>
        </div>

        {/* Right side - Wallet Connection */}
        <div className="flex items-center gap-3">
          {isConnected && chainInfo && (
            <Badge 
              variant="outline" 
              className="hidden gap-1.5 border-border/50 bg-secondary/50 sm:flex"
            >
              <span 
                className="size-2 rounded-full" 
                style={{ backgroundColor: chainInfo.color }}
              />
              {chainInfo.name}
            </Badge>
          )}
          
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted
              const connected = ready && account && chain

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover-glow"
                        >
                          Connect Wallet
                        </button>
                      )
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 font-medium text-destructive-foreground"
                        >
                          Wrong network
                        </button>
                      )
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={openChainModal}
                          className="hidden items-center gap-1.5 rounded-lg bg-secondary/50 px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary sm:flex"
                        >
                          {chain.hasIcon && chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              className="size-4 rounded-full"
                            />
                          )}
                        </button>
                        
                        <button
                          onClick={openAccountModal}
                          className="flex items-center gap-2 rounded-lg glass border border-border/50 px-3 py-2 font-mono text-sm transition-all hover:border-primary/50 hover:bg-primary/5"
                        >
                          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="hidden sm:inline">
                            {account.displayBalance ? `${account.displayBalance}` : ""}
                          </span>
                          <span className="text-primary">
                            {account.displayName}
                          </span>
                        </button>
                      </div>
                    )
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  )
}

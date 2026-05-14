"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Wallet, Shield, Zap, Flame } from "lucide-react"

export function ConnectPrompt() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Hero icon */}
        <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-2xl glass border border-primary/30 glow-primary">
          <Flame className="size-12 text-primary" />
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Clean Your{" "}
          <span className="text-primary text-glow-primary">Wallet</span>
        </h1>

        <p className="mx-auto mb-8 max-w-lg text-lg text-muted-foreground">
          Remove unwanted NFTs and subdomains from your wallet. 
          Burn spam, old airdrops, and clutter in one click.
        </p>

        {/* Connect button */}
        <div className="mb-12">
          <ConnectButton.Custom>
            {({ openConnectModal, mounted }) => {
              const ready = mounted
              return (
                <button
                  onClick={openConnectModal}
                  disabled={!ready}
                  className="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover-glow disabled:opacity-50"
                >
                  <Wallet className="size-5" />
                  Connect Wallet
                </button>
              )
            }}
          </ConnectButton.Custom>
        </div>

        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl glass border border-border/50 p-6 text-center transition-all hover:border-primary/30">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="size-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">Multi-Chain</h3>
            <p className="text-sm text-muted-foreground">
              Works on Ethereum, Polygon, and Base
            </p>
          </div>

          <div className="rounded-xl glass border border-border/50 p-6 text-center transition-all hover:border-primary/30">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Flame className="size-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">Batch Burn</h3>
            <p className="text-sm text-muted-foreground">
              Select multiple assets and burn them at once
            </p>
          </div>

          <div className="rounded-xl glass border border-border/50 p-6 text-center transition-all hover:border-primary/30">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="size-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">Spam Filter</h3>
            <p className="text-sm text-muted-foreground">
              Automatically detect and filter spam NFTs
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-xs text-muted-foreground">
          A micro-fee of ~$0.01 per asset helps keep this service running
        </p>
      </div>
    </div>
  )
}

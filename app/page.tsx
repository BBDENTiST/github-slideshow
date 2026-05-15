'use client';

import { useAccount } from 'wagmi';
import { Header } from '@/components/Header';
import { NFTGrid } from '@/components/NftGrid';
import { useNFTs } from '@/hooks/useNFTs';
import { Zap } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const { nfts, isLoading } = useNFTs();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground mb-6">
                Connect your Web3 wallet to view your NFT and subdomain collection. Then select
                assets you&apos;d like to permanently burn with a simple transaction.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Multi-chain support (Ethereum, Polygon, Base)</p>
                <p>✓ Premium domain protection</p>
                <p>✓ $0.01 fee per burned asset</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your NFT Collection</h2>
              <p className="text-muted-foreground">
                Securely burn unwanted NFTs and subdomains. Premium domains are protected by
                default.
              </p>
            </div>

            <NFTGrid nfts={nfts} isLoading={isLoading} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>0xagent — Premium Web3 Wallet Cleaner</p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            Burn with confidence. Your assets, your control.
          </p>
        </div>
      </footer>
    </div>
  );
}

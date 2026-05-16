'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass-dark border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/50 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-accent-foreground">0x</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">0xagent</h1>
            <p className="text-xs text-muted-foreground">NFT & Subdomain Burner</p>
          </div>
        </div>

        <ConnectButton />
      </div>
    </header>
  );
};

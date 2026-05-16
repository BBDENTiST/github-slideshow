'use client';

import { NFT } from '@/lib/alchemy';
import Image from 'next/image';
import { Zap, AlertTriangle } from 'lucide-react';

interface NFTCardProps {
  nft: NFT;
  isSelected: boolean;
  onToggle: () => void;
}

export const NFTCard = ({ nft, isSelected, onToggle }: NFTCardProps) => {
  const isPremium = nft.isPremiumDomain;

  return (
    <div
      onClick={onToggle}
      className={`group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
        isPremium
          ? 'ring-2 ring-destructive/50 bg-destructive/5'
          : isSelected
            ? 'ring-2 ring-accent'
            : 'hover:ring-2 hover:ring-accent/50'
      }`}
    >
      {/* Premium Domain Warning */}
      {isPremium && (
        <div className="absolute top-2 right-2 z-20 bg-destructive/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-destructive-foreground" />
          <span className="text-xs font-semibold text-destructive-foreground">PREMIUM</span>
        </div>
      )}

      {/* NFT Image Container */}
      <div className="relative w-full aspect-square bg-card overflow-hidden">
        {nft.image ? (
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23222" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" fill="%23666" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card to-card/50">
            <Zap className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2 z-20">
          <div
            className={`w-5 h-5 rounded border-2 transition-all ${
              isSelected
                ? 'bg-accent border-accent'
                : isPremium
                  ? 'border-destructive/50 bg-destructive/10'
                  : 'border-accent/50 bg-transparent group-hover:border-accent'
            }`}
          >
            {isSelected && (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-accent-foreground">
                ✓
              </div>
            )}
          </div>
        </div>

        {/* Chain Badge */}
        <div className="absolute bottom-2 right-2 z-10 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className="text-xs font-semibold text-accent capitalize">{nft.chain}</span>
        </div>
      </div>

      {/* NFT Details */}
      <div className="p-3 bg-card/50">
        <h3 className="font-semibold text-sm text-foreground truncate">{nft.name}</h3>
        <p className="text-xs text-muted-foreground truncate">
          #{nft.tokenId.substring(0, 8)}...
        </p>

        {nft.tokenType === 'ERC1155' && nft.balance && nft.balance > 1 && (
          <div className="mt-2 text-xs bg-muted/30 px-2 py-1 rounded text-muted-foreground text-center">
            Qty: {nft.balance}
          </div>
        )}
      </div>

      {/* Glow Effect for Selected */}
      {isSelected && <div className="absolute inset-0 bg-accent/10 pointer-events-none" />}
    </div>
  );
};

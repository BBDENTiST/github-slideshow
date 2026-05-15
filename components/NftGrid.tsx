'use client';

import { useState, useCallback, useMemo } from 'react';
import { NFT } from '@/lib/alchemy';
import { NFTCard } from './NftCard';
import { useBurn } from '@/hooks/useBurn';
import { Flame, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface NFTGridProps {
  nfts: NFT[];
  isLoading: boolean;
}

export const NFTGrid = ({ nfts, isLoading }: NFTGridProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [burnStatus, setBurnStatus] = useState<'idle' | 'burning' | 'success' | 'error'>('idle');
  const [burnMessage, setBurnMessage] = useState('');
  const { burn, isLoading: isBurning, error: burnError } = useBurn();

  // Calculate selectable NFTs (exclude premium domains)
  const selectableNFTs = useMemo(() => {
    return nfts.filter((nft) => !nft.isPremiumDomain);
  }, [nfts]);

  // Calculate total fee
  const totalFee = useMemo(() => {
    return (selected.size * 0.01).toFixed(4);
  }, [selected.size]);

  // Toggle NFT selection
  const toggleSelection = useCallback(
    (nft: NFT) => {
      // Prevent selecting premium domains
      if (nft.isPremiumDomain) {
        setBurnMessage('Premium domains cannot be burned');
        return;
      }

      const key = `${nft.contractAddress}-${nft.tokenId}`;
      const newSelected = new Set(selected);

      if (newSelected.has(key)) {
        newSelected.delete(key);
      } else {
        newSelected.add(key);
      }

      setSelected(newSelected);
      setBurnStatus('idle');
      setBurnMessage('');
    },
    [selected]
  );

  // Select all non-premium NFTs
  const selectAll = useCallback(() => {
    const newSelected = new Set<string>();
    selectableNFTs.forEach((nft) => {
      newSelected.add(`${nft.contractAddress}-${nft.tokenId}`);
    });
    setSelected(newSelected);
    setBurnStatus('idle');
    setBurnMessage('');
  }, [selectableNFTs]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelected(new Set());
    setBurnStatus('idle');
    setBurnMessage('');
  }, []);

  // Handle burn
  const handleBurn = useCallback(async () => {
    if (selected.size === 0) {
      setBurnMessage('No NFTs selected');
      setBurnStatus('error');
      return;
    }

    setBurnStatus('burning');
    setBurnMessage('Initiating burn sequence...');

    // Get the selected NFTs
    const selectedNFTsToburn = nfts.filter(
      (nft) => selected.has(`${nft.contractAddress}-${nft.tokenId}`)
    );

    const success = await burn(selectedNFTsToburn);

    if (success) {
      setBurnStatus('success');
      setBurnMessage(`Successfully burned ${selected.size} NFT(s)!`);
      setSelected(new Set());

      // Reset status after 3 seconds
      setTimeout(() => {
        setBurnStatus('idle');
        setBurnMessage('');
      }, 3000);
    } else {
      setBurnStatus('error');
      setBurnMessage(burnError || 'Failed to burn NFTs');
    }
  }, [selected, nfts, burn, burnError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your NFT collection...</p>
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No NFTs found in your wallet</p>
          <p className="text-xs text-muted-foreground">
            Your NFTs will appear here once you connect your wallet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="glass-dark p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-accent/20">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={selectAll}
            disabled={selectableNFTs.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md bg-accent/10 hover:bg-accent/20 text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearSelection}
            disabled={selected.size === 0}
            className="px-3 py-2 text-sm font-medium rounded-md bg-muted/30 hover:bg-muted/50 text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Fee Estimate</p>
            <p className="text-lg font-bold text-accent">${totalFee}</p>
          </div>

          <button
            onClick={handleBurn}
            disabled={selected.size === 0 || isBurning}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              isBurning
                ? 'bg-muted/30 text-muted-foreground cursor-not-allowed'
                : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
            }`}
          >
            {isBurning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Burning...
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" />
                Burn Selected
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {burnMessage && (
        <div
          className={`p-3 rounded-lg flex items-start gap-3 border ${
            burnStatus === 'success'
              ? 'bg-green-500/10 border-green-500/50 text-green-100'
              : burnStatus === 'error'
                ? 'bg-destructive/10 border-destructive/50 text-destructive-foreground'
                : 'bg-accent/10 border-accent/50 text-accent'
          }`}
        >
          {burnStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : burnStatus === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <Loader2 className="w-5 h-5 flex-shrink-0 mt-0.5 animate-spin" />
          )}
          <p className="text-sm">{burnMessage}</p>
        </div>
      )}

      {/* Premium Domains Warning */}
      {nfts.some((nft) => nft.isPremiumDomain) && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-100">
            <p className="font-semibold mb-1">Premium Domains Protected</p>
            <p>
              Rare domain subdomains are locked and cannot be selected for safety. Unlock them
              individually to burn.
            </p>
          </div>
        </div>
      )}

      {/* NFT Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {nfts.map((nft) => {
          const key = `${nft.contractAddress}-${nft.tokenId}`;
          const isSelected = selected.has(key);

          return (
            <NFTCard
              key={key}
              nft={nft}
              isSelected={isSelected}
              onToggle={() => toggleSelection(nft)}
            />
          );
        })}
      </div>

      {/* Selection Summary */}
      <div className="text-center p-4 text-sm text-muted-foreground">
        {selected.size > 0 ? (
          <p>
            {selected.size} NFT{selected.size !== 1 ? 's' : ''} selected for burning • Fee: ${totalFee}
          </p>
        ) : (
          <p>Select NFTs to burn • {selectableNFTs.length} selectable items</p>
        )}
      </div>
    </div>
  );
};

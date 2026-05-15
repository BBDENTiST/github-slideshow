'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { fetchNFTsForOwner, NFT } from '@/lib/alchemy';

export const useNFTs = () => {
  const { address, isConnected } = useAccount();

  const {
    data: nfts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['nfts', address],
    queryFn: async () => {
      if (!address) return [];
      
      try {
        // Fetch from all chains
        const [ethereumNFTs, polygonNFTs, baseNFTs] = await Promise.all([
          fetchNFTsForOwner(address, 'ethereum'),
          fetchNFTsForOwner(address, 'polygon'),
          fetchNFTsForOwner(address, 'base'),
        ]);

        return [...ethereumNFTs, ...polygonNFTs, ...baseNFTs];
      } catch (err) {
        console.error('[0xagent] Error in useNFTs:', err);
        return [];
      }
    },
    enabled: isConnected && !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    nfts,
    isLoading,
    error,
    refetch,
  };
};

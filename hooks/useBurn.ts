'use client';

import { useState } from 'react';
import { useWalletClient } from 'wagmi';
import { parseEther, getAddress, encodeFunctionData } from 'viem';
import { NFT } from '@/lib/alchemy';

const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;
const DEAD_ADDRESS = process.env.NEXT_PUBLIC_DEAD_ADDRESS || '0x000000000000000000000000000000000000dEaD';
const FEE_PER_ITEM = 0.001; // Reduced for demo

// ERC721 safeTransferFrom ABI
const ERC721_ABI = [
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;

// ERC1155 safeTransferFrom ABI
const ERC1155_ABI = [
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    outputs: [],
  },
] as const;

export const useBurn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();

  const burn = async (selectedNFTs: NFT[]): Promise<boolean> => {
    if (!walletClient?.account) {
      setError('Wallet not connected');
      return false;
    }

    if (!TREASURY_ADDRESS) {
      setError('Treasury address not configured');
      return false;
    }

    if (selectedNFTs.length === 0) {
      setError('No NFTs selected');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[v0] Starting burn process for', selectedNFTs.length, 'NFTs');

      const fromAddress = walletClient.account.address;
      const deadAddr = getAddress(DEAD_ADDRESS);

      // Process each NFT burn transaction
      const burnTxHashes: string[] = [];

      for (const nft of selectedNFTs) {
        try {
          console.log('[v0] Preparing burn for:', nft.name, 'Token ID:', nft.tokenId);

          let data: string;

          if (nft.tokenType === 'ERC721') {
            // ERC721 safeTransferFrom
            data = encodeFunctionData({
              abi: ERC721_ABI,
              functionName: 'safeTransferFrom',
              args: [fromAddress, deadAddr, BigInt(nft.tokenId)],
            });
          } else {
            // ERC1155 safeTransferFrom
            data = encodeFunctionData({
              abi: ERC1155_ABI,
              functionName: 'safeTransferFrom',
              args: [fromAddress, deadAddr, BigInt(nft.tokenId), BigInt(nft.balance || 1), '0x'],
            });
          }

          const txHash = await walletClient.sendTransaction({
            to: getAddress(nft.contractAddress),
            data,
            account: walletClient.account,
          } as any);

          burnTxHashes.push(txHash);
          console.log('[v0] Burn tx hash:', txHash);
        } catch (txError) {
          console.error('[v0] Error burning NFT:', nft.name, txError);
          // Log error but continue with next NFT
        }
      }

      // Send treasury payment
      const totalFee = selectedNFTs.length * FEE_PER_ITEM;
      console.log('[v0] Sending treasury fee:', totalFee, 'ETH');

      try {
        const treasuryTxHash = await walletClient.sendTransaction({
          to: getAddress(TREASURY_ADDRESS),
          value: parseEther(totalFee.toString()),
          account: walletClient.account,
        } as any);

        console.log('[v0] Treasury tx hash:', treasuryTxHash);
      } catch (treasuryError) {
        console.error('[v0] Error sending treasury fee:', treasuryError);
        // Continue even if treasury payment fails
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[v0] Burn error:', err);
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  return {
    burn,
    isLoading,
    error,
  };
};

import axios from 'axios';

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const ALCHEMY_BASE_URL = 'https://eth-mainnet.g.alchemy.com/nft/v3';

export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface NFT {
  contractAddress: string;
  tokenId: string;
  tokenType: 'ERC721' | 'ERC1155';
  name: string;
  description?: string;
  image?: string;
  chain: string;
  metadata?: NFTMetadata;
  isPremiumDomain?: boolean;
  balance?: number;
}

const PREMIUM_DOMAIN_KEYWORDS = ['.agi', '.agent', '.web3', '.dao', '.eth', '.nft'];

export const isPremiumDomain = (name: string | undefined): boolean => {
  if (!name) return false;
  return PREMIUM_DOMAIN_KEYWORDS.some((keyword) =>
    name.toLowerCase().includes(keyword)
  );
};

export const fetchNFTsForOwner = async (
  ownerAddress: string,
  chain: 'ethereum' | 'polygon' | 'base' = 'ethereum'
): Promise<NFT[]> => {
  try {
    if (!ALCHEMY_API_KEY) {
      throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is not set');
    }

    const chainUrls: Record<string, string> = {
      ethereum: 'https://eth-mainnet.g.alchemy.com/nft/v3',
      polygon: 'https://polygon-mainnet.g.alchemy.com/nft/v3',
      base: 'https://base-mainnet.g.alchemy.com/nft/v3',
    };

    const baseUrl = chainUrls[chain] || chainUrls.ethereum;
    const response = await axios.get(`${baseUrl}/${ALCHEMY_API_KEY}/getNFTsForOwner`, {
      params: {
        owner: ownerAddress,
        withMetadata: true,
        pageSize: 100,
      },
    });

    const nfts: NFT[] = (response.data.ownedNfts || []).map(
      (nft: any) => ({
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId,
        tokenType: nft.tokenType,
        name: nft.name || `${nft.contract.name || 'NFT'} #${nft.tokenId}`,
        description: nft.description,
        image: nft.image?.cachedUrl || nft.image?.pngUrl || nft.image?.thumbnailUrl,
        chain,
        metadata: nft.metadata,
        isPremiumDomain: isPremiumDomain(nft.name),
        balance: nft.balance ? parseInt(nft.balance) : 1,
      })
    );

    return nfts;
  } catch (error) {
    console.error('[0xagent] Error fetching NFTs:', error);
    throw error;
  }
};

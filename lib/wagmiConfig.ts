import { mainnet, polygon, base } from 'viem/chains';
import { createConfig, http } from 'wagmi';

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
});

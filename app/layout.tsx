import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/components/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '0xagent — NFT & Subdomain Burner',
  description: 'Premium Web3 utility platform for cleaning wallets and burning unwanted NFTs and subdomains.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${inter.className} antialiased`}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Web3Provider } from '@/components/providers/web3-provider'
import './globals.css'

const _geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans"
});
const _geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  title: '0xagent - Web3 Wallet Cleaner',
  description: 'Burn unwanted NFTs and subdomains from your wallet. Remove spam, old airdrops, and clutter in one click.',
  generator: '0xagent',
  keywords: ['NFT', 'burn', 'wallet', 'cleaner', 'Web3', 'Ethereum', 'Polygon', 'Base', 'ENS'],
  authors: [{ name: '0xagent' }],
  openGraph: {
    title: '0xagent - Web3 Wallet Cleaner',
    description: 'Burn unwanted NFTs and subdomains from your wallet. Remove spam, old airdrops, and clutter in one click.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '0xagent - Web3 Wallet Cleaner',
    description: 'Burn unwanted NFTs and subdomains from your wallet.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#00D1FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

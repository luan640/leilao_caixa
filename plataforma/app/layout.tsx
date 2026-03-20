import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Leilao OS',
  description:
    'Workspace SaaS para triagem, comparacao e monitoramento de ativos imobiliarios.',
  keywords: ['saas', 'dashboard', 'ativos', 'imoveis', 'monitoramento'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className="h-full min-h-screen antialiased"
        style={{
          backgroundColor: '#F2F3F7',
          color: '#111827',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  )
}

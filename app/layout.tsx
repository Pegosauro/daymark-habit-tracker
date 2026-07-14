import type { ReactNode } from 'react'
import '../src/styles.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        <meta name="theme-color" content="#f7f8f5" />
        <meta name="description" content="Daymark — un habit tracker semplice, sereno e locale." />
        <title>Daymark</title>
      </head>
      <body>{children}</body>
    </html>
  )
}

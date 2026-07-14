import type { ReactNode } from 'react'
import '../src/styles.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f7f8f5" />
        <meta name="description" content="Daymark — a calm, local-first habit tracker." />
        <title>Daymark</title>
      </head>
      <body>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDF Processing App',
  description: 'Upload PDFs and view processing results',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="nav-container">
          <div className="nav-content">
            <a href="/" className="nav-brand">PDF Processor</a>
            <div className="nav-links">
              <a href="/" className="nav-link">Upload</a>
              <a href="/results" className="nav-link">Results</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
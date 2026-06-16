import type { ReactNode } from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeToggle'
import { MainNav } from '@/components/layout/MainNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ScholarAI - AI-Powered Scholarship Management',
  description: 'Streamline scholarship applications with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNav />
          <main>{children}</main>
          <footer className="border-t border-border/40 mt-20">
            <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
              <p>© 2026 ScholarAI. Made with ❤️ for the next generation of scholars.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

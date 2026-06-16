'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { GraduationCap } from 'lucide-react'

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span>ScholarAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

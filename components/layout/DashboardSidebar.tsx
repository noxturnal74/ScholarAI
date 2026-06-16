'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Sparkles,
  Search,
  FileText,
  FolderOpen,
  Bell,
  User,
  Settings,
  BookOpen,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/analyzer', label: 'AI Analyzer', icon: Sparkles },
  { href: '/dashboard/scholarships', label: 'Scholarships', icon: Search },
  { href: '/dashboard/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/documents', label: 'Documents', icon: FolderOpen },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
]

const bottomNavItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r border-border/40 bg-background/60 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 px-2 mb-6">
        <BookOpen className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Student Dashboard</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 pt-4 border-t border-border/40">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Search, FileText, Clock, CheckCircle, TrendingUp, Bell } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Dashboard - ScholarAI',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  SUBMITTED: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  ACCEPTED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
}

export default async function DashboardPage() {
  // Fetch default student user
  const user = await prisma.user.findFirst({
    where: { email: 'john@example.com' },
    include: { profile: true, applications: { include: { scholarship: true } } }
  })

  // Get all scholarships to count and match
  const scholarships = await prisma.scholarship.findMany({
    orderBy: { deadline: 'asc' }
  })

  const totalScholarshipsCount = scholarships.length
  
  // Calculate dynamic stats based on database
  const userApplications = user?.applications || []
  const draftCount = userApplications.filter(a => a.status === 'DRAFT').length
  const activeCount = userApplications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length
  const pendingCount = userApplications.filter(a => a.status === 'UNDER_REVIEW').length
  const acceptedCount = userApplications.filter(a => a.status === 'ACCEPTED').length

  const stats = [
    {
      label: 'Scholarships Matched',
      value: String(totalScholarshipsCount),
      change: 'Based on profile',
      icon: Search,
      color: 'text-blue-500',
    },
    {
      label: 'Active Applications',
      value: String(activeCount),
      change: `${draftCount} drafts pending`,
      icon: FileText,
      color: 'text-orange-500',
    },
    {
      label: 'Pending Review',
      value: String(pendingCount),
      change: 'Awaiting response',
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      label: 'Accepted',
      value: String(acceptedCount),
      change: acceptedCount > 0 ? 'Congratulations!' : 'Keep applying!',
      icon: CheckCircle,
      color: 'text-green-500',
    },
  ]

  // Formatted recent applications
  const recentApps = userApplications.map(app => ({
    name: app.scholarship.title,
    deadline: app.scholarship.deadline,
    status: app.status,
    amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: app.scholarship.currency, maximumFractionDigits: 0 }).format(app.scholarship.amount)
  })).slice(0, 3)

  // Calculate profile strength
  let profileStrength = 0
  if (user?.profile) {
    const fields = ['gpa', 'graduationYear', 'major', 'university', 'highSchool', 'country']
    const completed = fields.filter(f => user.profile && user.profile[f as keyof typeof user.profile] !== null).length
    profileStrength = Math.round((completed / fields.length) * 100)
  }

  // Get upcoming deadlines
  const upcomingDeadlines = scholarships
    .filter(s => new Date(s.deadline) > new Date())
    .map(s => {
      const diffTime = Math.abs(new Date(s.deadline).getTime() - new Date().getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return {
        name: s.title,
        days: diffDays,
        urgent: diffDays <= 30
      }
    })
    .slice(0, 3)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good morning, {user?.name || 'Scholar'}! ??</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your scholarship journey.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/scholarships">
            <Search className="h-4 w-4 mr-2" />
            Find Scholarships
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="glass">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.change}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card className="glass lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Applications</CardTitle>
              <CardDescription>Your latest scholarship applications</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/applications">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentApps.length > 0 ? (
              recentApps.map((app) => (
                <div
                  key={app.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{app.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Deadline: {new Date(app.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="ml-3 flex flex-col items-end gap-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[app.status]}`}
                    >
                      {statusLabels[app.status]}
                    </span>
                    <span className="text-xs font-semibold text-primary">{app.amount}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No applications started yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions + Progress */}
        <div className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Profile Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-semibold">{profileStrength}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${profileStrength}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete your profile to get better scholarship matches
                </p>
                <Button variant="outline" size="sm" className="w-full glass" asChild>
                  <Link href="/profile">Complete Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{item.name}</span>
                    <span
                      className={`text-xs font-medium ml-2 shrink-0 ${
                        item.urgent ? 'text-destructive font-semibold' : 'text-muted-foreground'
                      }`}
                    >
                      {item.days}d left
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No upcoming deadlines.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

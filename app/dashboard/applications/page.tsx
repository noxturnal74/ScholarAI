import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Clock, CheckCircle, XCircle, Edit3, Eye } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'My Applications - ScholarAI',
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: Edit3 },
  SUBMITTED: { label: 'Submitted', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: FileText },
  UNDER_REVIEW: { label: 'Under Review', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', icon: Clock },
  ACCEPTED: { label: 'Accepted', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: XCircle },
}

export default async function ApplicationsPage() {
  // Fetch default student user
  const user = await prisma.user.findFirst({
    where: { email: 'john@example.com' },
    include: {
      applications: {
        include: {
          scholarship: {
            include: { provider: true }
          }
        }
      }
    }
  })

  const applications = user?.applications || []

  const counts = {
    total: applications.length,
    drafts: applications.filter((a) => a.status === 'DRAFT').length,
    submitted: applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length,
    accepted: applications.filter((a) => a.status === 'ACCEPTED').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-muted-foreground mt-1">Track all your scholarship applications</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: counts.total, color: 'text-foreground' },
          { label: 'Drafts', value: counts.drafts, color: 'text-gray-500' },
          { label: 'Submitted', value: counts.submitted, color: 'text-blue-500' },
          { label: 'Accepted', value: counts.accepted, color: 'text-green-500' },
        ].map((item) => (
          <Card key={item.label} className="glass">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">All Applications</CardTitle>
          <CardDescription>Manage and track your scholarship applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {applications.length > 0 ? (
            applications.map((app) => {
              const config = statusConfig[app.status] || statusConfig.DRAFT
              const Icon = config.icon
              const amountFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: app.scholarship.currency, maximumFractionDigits: 0 }).format(app.scholarship.amount)
              
              return (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{app.scholarship.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.scholarship.provider.name}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-semibold text-primary">{amountFormatted}</span>
                      <span className="text-xs text-muted-foreground">
                        Due {new Date(app.scholarship.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${config.className}`}>
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {app.status === 'DRAFT' && (
                        <Button size="sm" className="h-7 px-2 text-xs">
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">You have no applications yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

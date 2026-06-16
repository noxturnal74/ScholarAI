import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileText, Calendar, DollarSign, Award, CheckCircle, AlertCircle, Link as LinkIcon, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const metadata = {
  title: 'AI Opportunity Analyzer - ScholarAI',
}

export default async function AnalyzerPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams
  const scholarshipId = params.id

  // Fetch the analyzed scholarship if id is provided
  const analyzedOpportunity = scholarshipId
    ? await prisma.scholarship.findUnique({
        where: { id: scholarshipId },
      })
    : null

  // Fetch student user profile for eligibility matching
  const student = await prisma.user.findFirst({
    where: { email: 'john@example.com' },
    include: { profile: true },
  })

  // Calculate match score for the analyzed opportunity
  let matchScore = 50
  const matchReasons: string[] = []
  const missingRequirements: string[] = []

  if (analyzedOpportunity && student?.profile) {
    // GPA check
    if (analyzedOpportunity.minGpa !== null) {
      if (student.profile.gpa !== null && student.profile.gpa >= analyzedOpportunity.minGpa) {
        matchScore += 20
        matchReasons.push(`GPA requirement fulfilled (Minimum: ${analyzedOpportunity.minGpa}, Yours: ${student.profile.gpa})`)
      } else {
        matchScore -= 20
        missingRequirements.push(`GPA is below minimum requirement of ${analyzedOpportunity.minGpa}`)
      }
    } else {
      matchReasons.push('No minimum GPA requirement')
    }

    // Country/Nationality check
    if (analyzedOpportunity.country) {
      if (student.profile.country && student.profile.country.toLowerCase() === analyzedOpportunity.country.toLowerCase()) {
        matchScore += 20
        matchReasons.push(`Eligible country: matches ${student.profile.country}`)
      } else {
        matchReasons.push(`Open to applicants from ${analyzedOpportunity.country}`)
      }
    }

    // Major check
    if (analyzedOpportunity.major && analyzedOpportunity.major.length > 0 && student.profile.major) {
      const matchesMajor = analyzedOpportunity.major.some(
        (m) =>
          m.toLowerCase() === 'semua jurusan' ||
          m.toLowerCase() === student.profile?.major?.toLowerCase()
      )
      if (matchesMajor) {
        matchScore += 15
        matchReasons.push(`Suitable for your major: ${student.profile.major}`)
      }
    }

    // Funding check
    if (analyzedOpportunity.description.toLowerCase().includes('fully funded') || 
        analyzedOpportunity.description.toLowerCase().includes('fully-funded')) {
      matchScore += 15
      matchReasons.push('Fully funded opportunity')
    }

    // Application fee check
    if (analyzedOpportunity.description.toLowerCase().includes('application fee') ||
        analyzedOpportunity.description.toLowerCase().includes('charge')) {
      matchReasons.push('May require application fee (check disclaimer)')
    } else {
      matchScore += 10
      matchReasons.push('No application fee mentioned')
    }

    matchScore = Math.max(0, Math.min(100, matchScore))
  }

  // Server Action to analyze text
  async function analyzeTextAction(formData: FormData) {
    'use server'
    const rawText = formData.get('rawText') as string
    if (!rawText || rawText.trim().length < 10) {
      return
    }

    // Simple heuristic-based extraction (regex)
    // Extract title
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    let title = 'New Global Opportunity'
    if (lines.length > 0) {
      title = lines[0].replace(/\[\d+\/\d+,\s*\d+\.\d+\]\s*\+\d+\s*\d+\s*\d+:/, '').trim()
      if (title.length > 100) {
        title = title.substring(0, 97) + '...'
      }
    }

    // Extract application URL
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const urls = rawText.match(urlRegex)
    const applicationUrl = urls && urls.length > 0 ? urls[0] : 'https://opportunitiescorners.com'

    // Extract deadline
    let deadline = new Date()
    deadline.setDate(deadline.getDate() + 30)
    
    const deadlineRegex = /Deadline:\s*([0-9a-zA-Z\s]+)/i
    const deadlineMatch = rawText.match(deadlineRegex)
    if (deadlineMatch && deadlineMatch[1]) {
      const parsedDate = Date.parse(deadlineMatch[1].trim())
      if (!isNaN(parsedDate)) {
        deadline = new Date(parsedDate)
      }
    } else {
      const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
      for (const m of months) {
        const index = rawText.toLowerCase().indexOf(m)
        if (index !== -1) {
          const chunk = rawText.substring(index, index + 30)
          const yearMatch = chunk.match(/\b(202\d)\b/)
          const dayMatch = chunk.match(/\b(\d{1,2})\b/)
          if (yearMatch) {
            const day = dayMatch ? dayMatch[1] : '1'
            const parsedDate = Date.parse(`${day} ${m} ${yearMatch[1]}`)
            if (!isNaN(parsedDate)) {
              deadline = new Date(parsedDate)
              break
            }
          }
        }
      }
    }

    // Extract Country
    let country = 'Global'
    const countries = ['germany', 'japan', 'uk', 'usa', 'france', 'canada', 'china', 'spain', 'brazil', 'thailand', 'indonesia', 'switzerland', 'colombia', 'turkiye', 'turkey', 'korea', 'paris', 'bali']
    for (const c of countries) {
      if (rawText.toLowerCase().includes(c)) {
        country = c.charAt(0).toUpperCase() + c.slice(1)
        if (c === 'uk') country = 'United Kingdom'
        if (c === 'usa') country = 'United States'
        if (c === 'turkey') country = 'Turkiye'
        break
      }
    }

    // Extract Amount & Funding
    let amount = 15000000.0
    let currency = 'IDR'
    if (rawText.toLowerCase().includes('fully funded') || rawText.toLowerCase().includes('fully-funded')) {
      amount = 50000000.0
    }
    
    if (rawText.includes('$')) {
      currency = 'USD'
      const match = rawText.match(/\$\s*(\d+[,.]?\d*)/)
      if (match) amount = parseFloat(match[1].replace(/,/g, ''))
    } else if (rawText.toLowerCase().includes('euro')) {
      currency = 'EUR'
      const match = rawText.match(/(\d+[,.]?\d*)\s*euro/i)
      if (match) amount = parseFloat(match[1].replace(/,/g, ''))
    } else if (rawText.includes('Rp')) {
      currency = 'IDR'
      const match = rawText.match(/Rp\s*(\d+[,.]?\d*)/i)
      if (match) amount = parseFloat(match[1].replace(/\./g, '').replace(/,/g, ''))
    }

    // Extract category
    const category = ['S1']
    if (rawText.toLowerCase().includes('master') || rawText.toLowerCase().includes('postgraduate') || rawText.toLowerCase().includes('phd')) {
      category.push('S2')
    }
    if (rawText.toLowerCase().includes('phd') || rawText.toLowerCase().includes('doctoral')) {
      category.push('S3')
    }
    if (rawText.toLowerCase().includes('exchange') || rawText.toLowerCase().includes('summit') || rawText.toLowerCase().includes('conference')) {
      category.push('Exchange')
    }

    // Create the opportunity in the database
    const provider = await prisma.user.findFirst({
      where: { role: 'PROVIDER' },
    })

    const newScholarship = await prisma.scholarship.create({
      data: {
        title,
        description: rawText,
        amount,
        currency,
        deadline,
        status: 'ACTIVE',
        category,
        requirements: ['Check description for details'],
        minGpa: rawText.toLowerCase().includes('gpa') ? 3.0 : null,
        country,
        major: ['Semua Jurusan'],
        applicationUrl,
        providerId: provider?.id || 'default_provider_id',
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/scholarships')
    redirect(`/dashboard/analyzer?id=${newScholarship.id}`)
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          AI Opportunity Analyzer
        </h1>
        <p className="text-muted-foreground mt-1">
          Paste unstructured posts (WhatsApp, Instagram, etc.) to extract structured insights and assess eligibility.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Paste Input */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Paste Raw Text</CardTitle>
            <CardDescription>
              We will extract deadlines, benefits, eligibility, and match scores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={analyzeTextAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rawText">Opportunity Details</Label>
                <textarea
                  id="rawText"
                  name="rawText"
                  rows={12}
                  placeholder="Example: Korea Youth Summit 2026 | Call for Applications... Selected applicants will receive Accommodation, Meals... Deadline: 15 June 2026..."
                  className="w-full px-3 py-2 rounded-md border border-input bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none font-sans"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Analyze Opportunity
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Structured Results */}
        <div className="space-y-6">
          {analyzedOpportunity ? (
            <>
              {/* Match Score Card */}
              <Card className="glass">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Eligibility Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-primary/20 ring-4 ring-primary/10">
                      <span className="text-2xl font-bold text-primary">{matchScore}%</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {matchScore >= 80 ? 'Highly Eligible' : matchScore >= 60 ? 'Potentially Eligible' : 'Low Match'}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Compared against your student profile.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/20">
                    {matchReasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                    {missingRequirements.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span className="text-destructive font-medium">{r}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Structured Details Card */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-base">Structured Insights</CardTitle>
                  <CardDescription>Extracted details stored in database</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground block">Opportunity Name</span>
                      <span className="font-medium text-foreground">{analyzedOpportunity.title}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground block">Country</span>
                      <span className="font-medium text-foreground">{analyzedOpportunity.country || 'Global'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground block flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> Funding Amount
                      </span>
                      <span className="font-semibold text-primary">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: analyzedOpportunity.currency, maximumFractionDigits: 0 }).format(analyzedOpportunity.amount)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground block flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Deadline
                      </span>
                      <span className="font-medium text-foreground">
                        {new Date(analyzedOpportunity.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Category</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analyzedOpportunity.category.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {analyzedOpportunity.applicationUrl && (
                    <div className="pt-2 border-t border-border/20">
                      <Button asChild className="w-full gap-2">
                        <a href={analyzedOpportunity.applicationUrl} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-4 w-4" />
                          Apply on Official Website
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="glass h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="font-medium text-sm">No analysis active</p>
              <p className="text-xs mt-1 max-w-xs">
                Paste raw opportunity text on the left to extract structured fields and verify eligibility instantly.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

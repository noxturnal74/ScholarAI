import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search,  BookOpen, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Find Scholarships - ScholarAI',
}

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const params = await searchParams
  const searchQuery = params.search || ''

  // Fetch student user profile for matching
  const student = await prisma.user.findFirst({
    where: { email: 'john@example.com' },
    include: { profile: true }
  })

  // Query database
  const scholarships = await prisma.scholarship.findMany({
    where: searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { country: { contains: searchQuery, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { deadline: 'asc' },
  })

  // Match score calculation
  const mappedScholarships = scholarships.map((s) => {
    let score = 50 // Base match score
    const reasons: string[] = []

    if (student?.profile) {
      // GPA check
      if (s.minGpa !== null) {
        if (student.profile.gpa !== null && student.profile.gpa >= s.minGpa) {
          score += 20
          reasons.push('? GPA requirement fulfilled')
        } else {
          score -= 20
          reasons.push('? GPA below minimum requirement')
        }
      }

      // Country check
      if (s.country) {
        if (student.profile.country && student.profile.country.toLowerCase() === s.country.toLowerCase()) {
          score += 15
          reasons.push('? Nationality/Country matches')
        }
      }

      // Major check
      if (s.major && s.major.length > 0 && student.profile.major) {
        const matchesMajor = s.major.some(
          (m) =>
            m.toLowerCase() === 'semua jurusan' ||
            m.toLowerCase() === student.profile?.major?.toLowerCase()
        )
        if (matchesMajor) {
          score += 15
          reasons.push('? Suitable for your major')
        }
      }
    }

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score))

    return {
      ...s,
      match: score,
      reasons,
    }
  })

  // Action for search submit
  async function searchAction(formData: FormData) {
    'use server'
    const query = formData.get('search') as string
    redirect(query ? `/dashboard/scholarships?search=${encodeURIComponent(query)}` : '/dashboard/scholarships')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Find Scholarships</h1>
        <p className="text-muted-foreground mt-1">
          AI-matched opportunities based on your profile
        </p>
      </div>

      {/* Search Form */}
      <form action={searchAction} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={searchQuery}
            placeholder="Search scholarships by title, description or country..."
            className="glass pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Match Score Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> 80?100% match
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> 60?79% match
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-400 inline-block" /> Below 60%
        </span>
      </div>

      {/* Scholarships Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {mappedScholarships.length > 0 ? (
          mappedScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="glass hover:shadow-xl transition-shadow flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-semibold leading-snug">
                        {scholarship.title}
                      </CardTitle>
                      <CardDescription className="mt-0.5 text-xs">
                        {scholarship.country || 'Global'}
                      </CardDescription>
                    </div>
                    <div
                      className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
                        scholarship.match >= 80
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : scholarship.match >= 60
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {scholarship.match}% match
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {scholarship.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {scholarship.category.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {scholarship.reasons.length > 0 && (
                    <div className="text-[10px] bg-accent/30 p-2 rounded border border-border/20 space-y-0.5">
                      {scholarship.reasons.map((r, i) => (
                        <p key={i} className="text-muted-foreground">{r}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>

              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between text-xs border-t border-border/20 pt-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-semibold text-foreground">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: scholarship.currency, maximumFractionDigits: 0 }).format(scholarship.amount)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(scholarship.deadline).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex gap-2">
                  {scholarship.applicationUrl ? (
                    <Button asChild size="sm" className="flex-1 h-8 text-xs">
                      <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                        Official Site
                      </a>
                    </Button>
                  ) : (
                    <Button size="sm" className="flex-1 h-8 text-xs" disabled>
                      No Link
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs glass" asChild>
                    <Link href={`/dashboard/scholarships`}>
                      <BookOpen className="h-3 w-3 mr-1" />
                      Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-2 text-center text-muted-foreground py-10">
            No scholarships found matching your search.
          </p>
        )}
      </div>
    </div>
  )
}

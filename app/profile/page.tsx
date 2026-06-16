import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, GraduationCap, MapPin, Mail, Save } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const metadata = {
  title: 'Profile - ScholarAI',
}

export default async function ProfilePage() {
  // Fetch default student user
  const user = await prisma.user.findFirst({
    where: { email: 'john@example.com' },
    include: { profile: true }
  })

  // Calculate profile strength
  let profileStrength = 0
  if (user?.profile) {
    const fields = ['gpa', 'graduationYear', 'major', 'university', 'highSchool', 'country']
    const completed = fields.filter(f => user.profile && user.profile[f as keyof typeof user.profile] !== null).length
    profileStrength = Math.round((completed / fields.length) * 100)
  }

  async function updateProfile(formData: FormData) {
    'use server'
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const bio = formData.get('bio') as string
    const location = formData.get('location') as string
    const country = formData.get('country') as string
    const university = formData.get('university') as string
    const major = formData.get('major') as string
    const gpa = formData.get('gpa') ? parseFloat(formData.get('gpa') as string) : null
    const graduationYear = formData.get('graduationYear') ? parseInt(formData.get('graduationYear') as string) : null

    const financialNeed = formData.get('financialNeed') === 'on'
    const firstGenStudent = formData.get('firstGenStudent') === 'on'
    const militaryAffiliate = formData.get('militaryAffiliate') === 'on'

    const studentUser = await prisma.user.findFirst({
      where: { email: 'john@example.com' }
    })

    if (studentUser) {
      await prisma.user.update({
        where: { id: studentUser.id },
        data: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          bio,
          location,
          profile: {
            upsert: {
              create: {
                gpa,
                graduationYear,
                major,
                university,
                country,
                financialNeed,
                firstGenStudent,
                militaryAffiliate
              },
              update: {
                gpa,
                graduationYear,
                major,
                university,
                country,
                financialNeed,
                firstGenStudent,
                militaryAffiliate
              }
            }
          }
        }
      })
    }

    revalidatePath('/profile')
    revalidatePath('/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Keep your profile up to date for better scholarship matches
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar & Quick Info */}
        <Card className="glass md:col-span-1 h-fit">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{user?.name || 'John Doe'}</h2>
              <p className="text-sm text-muted-foreground">Student</p>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground text-left">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                {user?.email || 'john@example.com'}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                {user?.location || 'Jakarta, Indonesia'}
              </p>
              <p className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 shrink-0" />
                {user?.profile?.university || 'Not specified'}
              </p>
            </div>
            <Button variant="outline" className="w-full glass text-xs" size="sm" disabled>
              Change Photo
            </Button>

            {/* Profile Strength */}
            <div className="pt-2 text-left">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Profile strength</span>
                <span className="font-semibold">{profileStrength}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${profileStrength}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <form action={updateProfile} className="md:col-span-2 space-y-4">
          {/* Personal Information */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" defaultValue={user?.firstName || ''} className="glass" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" defaultValue={user?.lastName || ''} className="glass" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email || ''} className="glass" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" defaultValue={user?.phone || ''} placeholder="+62 812 3456 7890" className="glass" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  defaultValue={user?.bio || ''}
                  placeholder="Tell scholarship providers about yourself..."
                  className="w-full px-3 py-2 rounded-md border border-input bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">City</Label>
                  <Input id="location" name="location" defaultValue={user?.location || ''} placeholder="Jakarta" className="glass" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" defaultValue={user?.profile?.country || 'Indonesia'} className="glass" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Academic Information
              </CardTitle>
              <CardDescription>Your academic background for better matching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="university">University / Institution</Label>
                <Input id="university" name="university" defaultValue={user?.profile?.university || ''} placeholder="Universitas Indonesia" className="glass" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="major">Major / Field of Study</Label>
                  <Input id="major" name="major" defaultValue={user?.profile?.major || ''} placeholder="Computer Science" className="glass" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input id="gpa" name="gpa" type="number" step="0.01" min="0" max="4" defaultValue={user?.profile?.gpa || ''} placeholder="3.85" className="glass" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                <Input id="graduationYear" name="graduationYear" type="number" defaultValue={user?.profile?.graduationYear || ''} placeholder="2027" className="glass" />
              </div>
              <div className="space-y-3">
                <Label>Additional Information</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" name="financialNeed" defaultChecked={user?.profile?.financialNeed || false} className="rounded" />
                    <span>I have demonstrated financial need</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" name="firstGenStudent" defaultChecked={user?.profile?.firstGenStudent || false} className="rounded" />
                    <span>I am a first-generation college student</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" name="militaryAffiliate" defaultChecked={user?.profile?.militaryAffiliate || false} className="rounded" />
                    <span>I have military affiliation</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full gap-2" size="lg">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  )
}

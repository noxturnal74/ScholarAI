import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Sign Up - ScholarAI',
  description: 'Create your ScholarAI account',
}

export default function SignUpPage() {
  async function handleSignUp() {
    'use server'
    redirect('/dashboard')
  }
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground mt-2">
            Start your scholarship journey today
          </p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="glass"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="glass"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="glass"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="glass"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="glass"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <select
                  id="role"
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background/70 backdrop-blur-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                  <option value="provider">Scholarship Provider</option>
                </select>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/sign-in" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

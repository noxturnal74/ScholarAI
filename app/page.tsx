import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          AI-Powered <span className="text-primary">Scholarship</span> Management
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Streamline your scholarship applications with intelligent matching, 
          automated recommendations, and AI-powered essay assistance.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="glass">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" className="glass">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Smart Matching',
              description: 'AI-powered algorithm matches you with scholarships you qualify for',
              icon: '\u{1F3AF}',
            },
            {
              title: 'Automated Tracking',
              description: 'Track all your applications in one organized dashboard',
              icon: '\u{1F4CA}',
            },
            {
              title: 'Essay Assistant',
              description: 'AI-powered suggestions to improve your scholarship essays',
              icon: '\u{270D}\u{FE0F}',
            },
          ].map((feature, i) => (
            <Card key={i} className="glass hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="mt-2">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-center">By the Numbers</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Scholarships', value: '10K+' },
              { label: 'Students Helped', value: '5K+' },
              { label: 'Success Rate', value: '85%' },
              { label: 'Total Awards', value: '+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      
      {/* Support Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="glass max-w-lg mx-auto border border-primary/10">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg flex items-center justify-center gap-2">
              Dukung Pengembangan Platform {"\u{1F496}"}
            </CardTitle>
            <CardDescription className="text-xs">
              Bantu kami menjaga server tetap berjalan gratis untuk seluruh mahasiswa Indonesia.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              Dukungan operasional/donasi dapat ditransfer melalui:
            </p>
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 inline-block font-mono text-sm">
              <p className="font-bold text-primary">BCA: 4480784567</p>
              <p className="text-xs text-muted-foreground mt-0.5">a.n. Albert William Saputra</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="glass overflow-hidden">
          <CardContent className="p-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Scholarship?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of students who are already using ScholarAI to 
              discover and apply for scholarships that match their profile.
            </p>
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Start Your Journey Today</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
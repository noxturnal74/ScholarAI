import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, BarChart3, PenTool, Heart, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(0,0,0,0))]">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center max-w-4xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Powered by Advanced AI Matching
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-foreground">
          AI-Powered <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600">Scholarship</span> Management
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Streamline your scholarship applications with intelligent matching, 
          automated recommendations, and AI-powered essay assistance. Designed for future leaders.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="rounded-full px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            <Link href="/auth/sign-up">Get Started for Free</Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8 glass hover:bg-muted/50 transition-all">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Core Capabilities</h2>
          <p className="text-muted-foreground mt-2">Tools designed to accelerate your opportunities</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Smart Matching',
              description: 'AI-powered algorithm matches you with scholarships you qualify for.',
              icon: Target,
              color: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'Automated Tracking',
              description: 'Track all your applications in one organized dashboard.',
              icon: BarChart3,
              color: 'from-indigo-500 to-purple-500'
            },
            {
              title: 'Essay Assistant',
              description: 'AI-powered suggestions to improve your scholarship essays.',
              icon: PenTool,
              color: 'from-violet-500 to-fuchsia-500'
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="glass hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-3xl border border-white/10 shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`} />
                <CardContent className="pt-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <Card className="glass rounded-3xl border border-white/10 shadow-md overflow-hidden relative">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">By the Numbers</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            {[
              { label: 'Active Scholarships', value: '10K+' },
              { label: 'Students Helped', value: '5K+' },
              { label: 'Success Rate', value: '85%' },
              { label: 'Total Awards', value: 'IDR 150B+' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">{stat.value}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Support / Credit Card Section */}
      <section className="container mx-auto px-4 py-16 max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
            Support Our Platform <Heart className="h-6 w-6 text-destructive fill-destructive" />
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Help keep this platform free for all Indonesian students</p>
        </div>
        
        {/* Apple-like Debit Card */}
        <div className="relative w-full h-56 rounded-3xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white p-6 shadow-2xl border border-zinc-700/50 flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
          
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Premium Support Card</p>
              <div className="w-10 h-7 bg-amber-400/80 rounded-md mt-4 shadow-sm border border-amber-300/30 flex items-center justify-center">
                <div className="w-full h-[1px] bg-amber-500/30" />
              </div>
            </div>
            <span className="font-extrabold text-sm tracking-wider text-zinc-300">ScholarAI</span>
          </div>

          <div className="space-y-4 z-10">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 tracking-widest uppercase">BCA Account Number</p>
              <p className="text-xl md:text-2xl font-mono tracking-widest font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">4480 7845 67</p>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-zinc-500 tracking-widest uppercase">Card Holder</p>
                <p className="text-sm font-semibold tracking-wide text-zinc-200">Albert William Saputra</p>
              </div>
              <span className="text-xs font-bold text-zinc-400">IDN</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <Card className="glass overflow-hidden rounded-3xl border border-white/10 shadow-xl relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]" />
          <CardContent className="p-12 md:p-20 text-center relative z-10">
            <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Ready to Find Your Scholarship?</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of students who are already using ScholarAI to 
              discover and apply for scholarships that match their profile.
            </p>
            <Button asChild size="lg" className="rounded-full px-10 bg-foreground text-background hover:bg-foreground/90 shadow-md">
              <Link href="/auth/sign-up">Start Your Journey Today</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

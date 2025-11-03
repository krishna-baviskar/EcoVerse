'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Trophy,
  Leaf,
  Heart,
  BarChart,
  Target,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between h-20 px-4 md:px-8 border-b bg-background/80 backdrop-blur-sm">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="#features">Features</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#about">About</Link>
          </Button>
          <Button variant="primary" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32 bg-card">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80')",
            }}
          ></div>
          <div className="container relative z-10">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
              Join the Movement for a Greener Planet
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              EcoVerse helps you understand your environmental impact, adopt
              sustainable habits, and compete with your community to make a real
              difference.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard">Start Your Eco-Journey</Link>
            </Button>
          </div>
        </section>

        {/* Our Mission */}
        <section id="mission" className="py-16 md:py-24">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We believe that collective individual action can create massive
              positive change. EcoVerse was created to empower everyone with
              the tools and knowledge to live more sustainably, making environmental
              consciousness an engaging, rewarding, and collaborative experience.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-card">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Features at a Glance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={TrendingUp}
                title="Track Your EcoScore"
                description="Get a real-time score based on local environmental data like air quality, temperature, and humidity."
              />
              <FeatureCard
                icon={Target}
                title="Personalized Challenges"
                description="Receive tailored challenges based on your score and location to help you improve."
              />
              <FeatureCard
                icon={Users}
                title="Community Leaderboard"
                description="Compete with friends and neighbors to see who can earn the most EcoPoints and make the biggest impact."
              />
              <FeatureCard
                icon={Trophy}
                title="Earn Rewards"
                description="Gain EcoPoints for logging sustainable actions and unlock achievements and perks."
              />
            </div>
          </div>
        </section>
        
        {/* Why Use EcoVerse Section */}
        <section className="py-16 md:py-24">
            <div className="container grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Why Use EcoVerse?</h2>
                    <p className="text-muted-foreground mb-6">EcoVerse transforms sustainability from a chore into a rewarding adventure. It provides clear, actionable insights and fosters a sense of community, empowering you to:</p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <Leaf className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold">Live Consciously</h4>
                                <p className="text-muted-foreground">Make informed decisions with real-time data about your local environment.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold">Stay Motivated</h4>
                                <p className="text-muted-foreground">Gamified challenges and leaderboards make building sustainable habits fun and engaging.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-3">
                            <BarChart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold">See Your Impact</h4>
                                <p className="text-muted-foreground">Visually track your progress and see how your individual actions contribute to the community's overall score.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                 <div className="order-1 md:order-2">
                    <Image 
                        src="https://picsum.photos/seed/landing1/600/500" 
                        alt="A person interacting with nature on a phone" 
                        width={600} 
                        height={500} 
                        className="rounded-lg shadow-lg"
                        data-ai-hint="person environment"
                    />
                </div>
            </div>
        </section>

        {/* EcoScore Explained Section */}
        <section id="ecoscore" className="py-16 md:py-24 bg-card">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Understanding Your EcoScore
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-2xl font-bold font-headline mb-2">What is an EcoScore?</h3>
                <p className="text-muted-foreground">
                  Your EcoScore is a dynamic rating from 0-100 that reflects
                  the environmental health of your current location. A higher
                  score indicates a cleaner, more sustainable environment.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-headline mb-2">How is it Calculated?</h3>
                <p className="text-muted-foreground">
                  We use real-time data for Air Quality Index (AQI), temperature,
                  and humidity. The formula is a weighted average: <br />
                  <code className="text-xs text-primary font-mono p-2 bg-primary/10 rounded-md mt-2 inline-block">
                    (AQIScore * 0.5) + (TempScore * 0.3) + (HumidityScore * 0.2)
                  </code>
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-headline mb-2">What are EcoPoints?</h3>
                <p className="text-muted-foreground">
                  EcoPoints are rewards you earn for completing sustainable
                  actions and challenges. They are your personal score, showing
                  your commitment and contribution to the community.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Commitment Section */}
        <section id="commitment" className="py-16 md:py-24">
            <div className="container">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">Our Commitment</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="bg-card p-6 rounded-lg">
                        <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                        <h3 className="text-xl font-bold font-headline mb-2">User Security & Privacy</h3>
                        <p className="text-muted-foreground">Your privacy is paramount. We only use location data to calculate your EcoScore and provide local challenges. Your personal information is securely stored with Firebase Authentication and is never shared without your consent.</p>
                    </div>
                    <div className="bg-card p-6 rounded-lg">
                        <Leaf className="h-8 w-8 text-primary mb-4" />
                        <h3 className="text-xl font-bold font-headline mb-2">Promoting Sustainability</h3>
                        <p className="text-muted-foreground">Our goal is to make sustainable living accessible and achievable. The app is designed to educate and inspire, providing clear, actionable steps that anyone can take to reduce their environmental footprint and contribute to a healthier planet.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* About Us & Contact */}
        <section id="about" className="py-16 md:py-24 bg-card">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
              About Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              We are a passionate team of developers and environmentalists
              dedicated to using technology for good. EcoVerse is our contribution
              to a more sustainable future.
            </p>
            <div className="flex justify-center items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">
                Get in touch: <a href="mailto:contact@ecoverse.app" className="font-semibold text-primary hover:underline">contact@ecoverse.app</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-6 border-t">
          <div className="container text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} EcoVerse. All Rights Reserved.
          </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center p-6 rounded-lg transition-all hover:bg-background hover:shadow-lg">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-primary/10 rounded-full">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-bold font-headline mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

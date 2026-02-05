
'use client';

import { 
  Leaf, TrendingUp, Users, Trophy, Heart, BarChart, Target, Mail, 
  ChevronRight, Play, CheckCircle2, Globe, Zap, Shield, Code, 
  Brain, Sparkles, ArrowRight, Menu, X, Github, Twitter, Linkedin,
  MessageSquare, BookOpen, Download, Star, Award, Atom, Rocket,
  Lock, Database, Cloud, Cpu, Activity, Map, Sun, Wind, Droplets, UserCheck, Edit, BarChart2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useUser } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function EcoVerseLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handleLaunchApp = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };


  const founder1 = PlaceHolderImages.find(img => img.id === 'founder1');
  const founder2 = PlaceHolderImages.find(img => img.id === 'founder2');


  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-xl border-b border-white/10`}>
        <nav className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <Leaf className="h-8 md:h-10 w-8 md:w-10 text-emerald-400 relative transform group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  EcoVerse
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-emerald-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-emerald-400 transition-colors">How It Works</a>
              <a href="#get-started" className="text-gray-300 hover:text-emerald-400 transition-colors">Get Started</a>
              <a href="#about" className="text-gray-300 hover:text-emerald-400 transition-colors">About</a>
              <button onClick={handleLaunchApp} className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
                  Launch App
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 text-center">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-emerald-400">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-emerald-400">How It Works</a>
              <a href="#get-started" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-emerald-400">Get Started</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-emerald-400">About</a>
               <button onClick={() => { handleLaunchApp(); setMobileMenuOpen(false); }} className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg font-semibold">
                  Launch App
                </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">AI-Powered • Real-Time Data • Gamified</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Transform Cities
            </span>
            <br />
            <span className="text-white">Into Eco-Paradises</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            The world's first AI-powered gamified platform that measures, predicts, and improves urban sustainability through community action and real-time environmental insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={handleLaunchApp} className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                Start Your Eco-Journey
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="https://www.youtube.com/watch?v=Kcz-YEw6tGQ" target="_blank" rel="noopener noreferrer" className="group w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Play className="h-5 w-5" />
              Watch Demo
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '100+', label: 'Cities Tracked' },
              { value: '2M+', label: 'EcoPoints Earned' },
              { value: '95%', label: 'User Satisfaction' }
            ].map((stat, i) => (
              <div key={i} className="p-4 md:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-6 w-6 text-emerald-400 rotate-90" />
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-semibold">
                THE PROBLEM
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Urban Sustainability Is <span className="text-red-400">Invisible</span> & <span className="text-red-400">Overwhelming</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <X className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">No Real-Time Visibility</h4>
                    <p className="text-gray-400">Citizens have no idea about their city's environmental health in real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Lack of Actionable Insights</h4>
                    <p className="text-gray-400">People want to help but don't know where to start or what actions matter</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Zero Motivation</h4>
                    <p className="text-gray-400">Sustainability feels like a chore with no immediate feedback or rewards</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 mt-16 md:mt-0">
              <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-semibold">
                THE SOLUTION
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                EcoVerse Makes Sustainability <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Visible, Fun & Rewarding</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Real-Time EcoScore Dashboard</h4>
                    <p className="text-gray-400">Live environmental metrics from AQI, weather, traffic, and waste APIs combined into one score</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">AI-Powered Recommendations</h4>
                    <p className="text-gray-400"> AI explains your score and suggests personalized, actionable eco-challenges</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Gamified Community Experience</h4>
                    <p className="text-gray-400">Earn points, unlock badges, compete on leaderboards, and see your impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Revolutionary Features
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Powered by cutting-edge AI and real-time APIs to deliver unprecedented urban sustainability insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'EcoScore Dashboard',
                description: 'Real-time environmental metrics aggregated into a single 0-100 score. Track AQI, temperature, humidity, and more.',
                gradient: 'from-emerald-500 to-green-500'
              },
              {
                icon: Brain,
                title: 'EcoGPT AI Tutor',
                description: 'Conversational AI powered that explains your score, answers eco-questions, and generates personalized challenges.',
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                icon: Target,
                title: 'Smart Challenges',
                description: 'AI-generated eco-challenges tailored to your city needs. Complete tasks, earn points, and see measurable impact.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Activity,
                title: 'Predictive Analytics',
                description: ' AI predicts future EcoScore trends and shows the impact of collective actions before they happen.',
                gradient: 'from-pink-500 to-red-500'
              },
              {
                icon: Users,
                title: 'Community Leaderboard',
                description: 'Compete with other cities and users. See who is making the biggest environmental impact in real-time.',
                gradient: 'from-orange-500 to-yellow-500'
              },
              {
                icon: Trophy,
                title: 'Rewards & Badges',
                description: 'Unlock achievements like Green Warrior and Eco Champion. Gamified progress tracking keeps you motivated.',
                gradient: 'from-yellow-500 to-emerald-500'
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              How <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">EcoVerse</span> Works
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              From data collection to AI insights to community action - here is the complete journey
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 -translate-x-1/2"></div>

            <div className="space-y-16">
              {[
                {
                  step: '01',
                  title: 'Data Collection',
                  description: 'EcoVerse connects to multiple open APIs including OpenWeatherMap and WAQI for real-time weather and air quality data, fetched through Next.js serverless functions.',
                  icon: Database,
                  color: 'emerald'
                },
                {
                  step: '02',
                  title: 'AI Processing',
                  description: ' AI and ML flows process the raw environmental data. The AI normalizes metrics, applies weighted algorithms, and generates a comprehensive EcoScore from 0-100.',
                  icon: Brain,
                  color: 'blue'
                },
                {
                  step: '03',
                  title: 'Intelligent Insights',
                  description: 'The AI Tutor (powered by AI) explains your score in conversational language, identifies problem areas, and suggests specific actions and challenges.',
                  icon: Sparkles,
                  color: 'purple'
                },
                {
                  step: '04',
                  title: 'Community Engagement',
                  description: 'Your actions are validated by AI and added to the community leaderboard. Compete, earn badges, and see how collective efforts improve the overall EcoScore.',
                  icon: Users,
                  color: 'pink'
                },
              ].map((item, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div key={i} className={`md:flex items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2 md:px-8">
                      <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-full mb-6`}>
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className={`inline-block px-4 py-1 bg-${item.color}-500/10 border border-${item.color}-500/20 rounded-full text-${item.color}-400 text-sm font-bold mb-4`}>
                          STEP {item.step}
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:block w-1/2 relative">
                         <div className={`absolute top-1/2 ${isEven ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}  transform -translate-y-1/2 w-6 h-6 bg-${item.color}-500 rounded-full border-4 border-slate-950`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Get Started in 3 Easy Steps
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Joining the EcoVerse community and making an impact is simple and rewarding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: UserCheck,
                title: 'Create Your Account',
                description: 'Sign up for free in seconds. All you need is an email to join the green revolution.',
              },
              {
                icon: Edit,
                title: 'Set Your Location',
                description: 'Enter your city to get personalized, real-time EcoScore data and relevant local challenges.',
              },
              {
                icon: BarChart2,
                title: 'Track & Improve',
                description: 'Log your sustainable actions, complete challenges, and watch your EcoScore and community rank climb!',
              },
            ].map((step, i) => (
              <div key={i} className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <span className="text-3xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EcoScore Algorithm Section */}
      <section className="py-24 px-6 relative bg-gradient-to-b from-transparent to-slate-950/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                The EcoScore Algorithm
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400">
              How we calculate sustainability in real-time
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="space-y-8">
              <div>
                  <h3 className="text-2xl font-bold mb-4">1. Data Normalization</h3>
                  <p className="text-gray-400 mb-4">
                      First, we take raw data from our connected APIs and convert each metric into a normalized score from 0 to 100, where higher is better. This allows us to compare different types of data on the same scale.
                  </p>
                  <div className="space-y-4">
                      <div className="p-4 bg-slate-900 rounded-xl">
                          <h4 className="font-semibold text-emerald-300">Air Quality Score (AQI):</h4>
                          <p className="text-sm text-gray-300">Calculated as `100 - (AQI / 500 * 100)`. A lower AQI value results in a higher score.</p>
                      </div>
                      <div className="p-4 bg-slate-900 rounded-xl">
                          <h4 className="font-semibold text-blue-300">Temperature Score:</h4>
                          <p className="text-sm text-gray-300">Scores are based on proximity to an ideal temperature of 24°C. The closer the temperature, the higher the score.</p>
                      </div>
                      <div className="p-4 bg-slate-900 rounded-xl">
                          <h4 className="font-semibold text-purple-300">Humidity Score:</h4>
                          <p className="text-sm text-gray-300">Scores are based on proximity to an ideal humidity level of 55%. Deviations from this value lower the score.</p>
                      </div>
                  </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4">2. Weighted Formula</h3>
                <p className="text-gray-400 mb-4">
                    Once normalized, we combine the scores using a weighted formula that prioritizes factors with the greatest impact on environmental health and human well-being. Air quality is given the highest weight.
                </p>
                <div className="p-6 bg-slate-900 rounded-xl overflow-x-auto">
                  <pre className="text-emerald-400 text-base md:text-lg font-mono whitespace-pre-wrap">
{`EcoScore = (AirQualityScore × 0.5) + (TempScore × 0.3) + (HumidityScore × 0.2)`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Team Section */}
      <section id="about" className="py-24 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                About EcoVerse
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Built by passionate developers and environmentalists dedicated to creating technology for a sustainable future
            </p>
          </div>

          <div className="space-y-12">
            <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                We envision a world where every citizen has real-time visibility into their city's environmental health 
                and the tools to make a positive impact. EcoVerse transforms abstract sustainability concepts into 
                concrete, actionable insights powered by AI.
              </p>
              <p className="text-gray-400 leading-relaxed">
                By gamifying eco-friendly behaviors and providing predictive analytics, we are creating a global 
                movement where communities compete to build the greenest, most sustainable cities on Earth.
              </p>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold text-center mb-12">Meet the Developer</h3>
              <div className="grid md:grid-cols-2 gap-10">
                
                {founder1 && <div className="flex flex-col items-center md:flex-row gap-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full blur-xl opacity-60"></div>
                    <div className="relative w-32 h-32 flex items-center justify-center bg-slate-800 rounded-full border-2 border-white/20 overflow-hidden">
                      <Image src="/krishna.png" alt="Founder" layout="fill" className="object-cover" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl font-bold">Krishna Somnath Baviskar</h4>
                    <p className="text-sm text-emerald-400 mb-3">Lead Developer</p>
                    <p className="text-gray-400 italic">"Technology should be a force for good. With AI, we can finally make sustainability data understandable and actionable for everyone."</p>
                  </div>
                </div>}

              

              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Privacy First',
                  description: 'Your data is encrypted and never shared. We only use location for EcoScore calculation.'
                },
                {
                  icon: Globe,
                  title: 'Global Impact',
                  description: 'Join 100+ cities worldwide working together to create a more sustainable planet.'
                },
                {
                  icon: Heart,
                  title: 'Community Driven',
                  description: 'Open-source and built with community feedback. Everyone can contribute.'
                }
              ].map((value, i) => (
                <div key={i} className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="p-8 md:p-12 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-3xl backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your City?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of eco-warriors making real environmental impact through AI-powered insights and community action.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={handleLaunchApp} className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    Launch EcoVerse Now
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="h-8 w-8 text-emerald-400" />
                <h3 className="text-xl font-bold">EcoVerse</h3>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered platform for measuring and improving urban sustainability.
              </p>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a></li>
                <li><a href="#get-started" className="hover:text-emerald-400 transition-colors">Get Started</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4 mb-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-gray-400">
                <Mail className="h-4 w-4 inline mr-2" />
                ideans.team@gmail.com
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>&copy; 2024 EcoVerse. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

    

    

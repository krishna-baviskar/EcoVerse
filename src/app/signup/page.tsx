
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Mail, Lock, User, ArrowRight, Sparkles, Shield, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

export default function SignupPage3D() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    displayName: '',
    email: '',
    password: ''
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateForm = () => {
    const newErrors = { displayName: '', email: '', password: '' };
    let isValid = true;

    if (formData.displayName.length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: formData.displayName });

      const userRef = doc(firestore, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        uid: user.uid,
        displayName: formData.displayName,
        email: user.email,
        photoURL: user.photoURL || '',
        ecoPoints: 0,
      }, {});

      toast({
        title: 'Account Created',
        description: "Welcome to EcoVerse!",
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            animationDelay: '1s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.y}px, ${mousePosition.x}px)`,
            animationDelay: '2s'
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Logo */}
       <div className="absolute top-8 left-8 z-20">
            <Link href="/">
                <Logo className="text-white"/>
            </Link>
        </div>


      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Info */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">Join 50,000+ Eco Warriors</span>
            </div>
            
            <h2 className="text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Start Your
              </span>
              <br />
              <span className="text-white">Sustainability Journey</span>
            </h2>
            
            <p className="text-xl text-gray-400">
              Transform your city into an eco-paradise with AI-powered insights, real-time environmental data, and gamified challenges.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your data is encrypted and protected'
              },
              {
                icon: Sparkles,
                title: 'AI-Powered Insights',
                description: 'Get personalized eco-recommendations'
              },
              {
                icon: CheckCircle2,
                title: 'Earn Rewards',
                description: 'Unlock badges and climb leaderboards'
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '50K+', label: 'Users' },
              { value: '100+', label: 'Cities' },
              { value: '2M+', label: 'EcoPoints' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="relative">
          {/* 3D Card Container */}
          <div 
            className="relative"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            
            {/* Main Card */}
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-4 animate-bounce">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Create Account</h3>
                <p className="text-gray-400">Join the green revolution today</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-400" />
                    Full Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  </div>
                  {errors.displayName && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.displayName}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-400" />
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-emerald-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl font-bold text-white hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-sm text-gray-400">or continue with</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/10 animate-float"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

    
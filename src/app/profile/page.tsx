
'use client';

import {
  Award,
  Bot,
  Coins,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  PlusCircle,
  Trophy,
  User as UserIcon,
  Users,
  Leaf,
  Star,
  Target,
  TrendingUp,
  Calendar,
  Zap,
  Shield,
  Crown,
  Gem,
  Flame,
  Droplets,
  Wind,
  ChevronDown,
  Menu,
  X,
  Bell,
  Settings,
  Camera,
  Edit,
  CheckCircle2,
  Lock,
  ArrowRight,
  Activity,
  BarChart3,
  Clock,
  ThumbsUp,
  MessageSquare,
  Share2,
  Gift,
  Heart,
  BarChart as BarChartIcon,
  LineChart,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useAuth,
  useUser,
  useDoc,
  useFirestore,
  useMemoFirebase,
  updateDocumentNonBlocking,
  useCollection,
} from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, doc, limit, orderBy, query } from 'firebase/firestore';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  CartesianGrid,
  RadialBarChart,
  PolarAngleAxis,
  RadialBar,
} from 'recharts';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { LogActionDialog } from '@/components/dashboard/log-action-dialog';
import { Logo } from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';
import { FloatingEcoTutor } from '@/components/dashboard/floating-eco-tutor';
import { Leaderboard } from '@/components/dashboard/leaderboard';
import { UpdateLocationDialog } from '@/components/dashboard/update-location-dialog';
import { predictEcoScore, type PredictEcoScoreOutput } from '@/ai/flows';
import { LoadingSpinner } from '@/components/loading-spinner';
import { format } from 'date-fns';

const ecoScoreTrendData = [
  { month: 'Jan', ecoScore: 65 },
  { month: 'Feb', ecoScore: 68 },
  { month: 'Mar', ecoScore: 72 },
  { month: 'Apr', ecoScore: 70 },
  { month: 'May', ecoScore: 75 },
  { month: 'Jun', ecoScore: 78 },
];

const weeklyGoalData = [
  { name: 'Weekly Goal', value: 450, goal: 1000, fill: 'hsl(var(--primary))' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [ecoScoreData, setEcoScoreData] = useState<PredictEcoScoreOutput | null>(
    null
  );
  const [isLoadingEcoScore, setIsLoadingEcoScore] = useState(true);

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc<UserProfile>(userDocRef);

  const usersCollectionRef = useMemoFirebase(
    () => collection(firestore, 'users'),
    [firestore]
  );
  const leaderboardQuery = useMemoFirebase(
    () =>
      usersCollectionRef
        ? query(usersCollectionRef, orderBy('ecoPoints', 'desc'))
        : null,
    [usersCollectionRef]
  );
  const { data: leaderboardData, isLoading: isLeaderboardLoading } =
    useCollection(leaderboardQuery);

  const userRank = useMemo(() => {
    if (!leaderboardData || !user) return 'N/A';
    const index = leaderboardData.findIndex(p => p.id === user.uid);
    return index !== -1 ? index + 1 : 'N/A';
  }, [leaderboardData, user]);

  const barChartData = useMemo(() => [
    { name: 'Scores', 'Your EcoPoints': userProfile?.ecoPoints || 0, 'City EcoScore': ecoScoreData?.ecoScore || 0 },
  ], [userProfile, ecoScoreData]);

  const fetchEcoScore = useCallback(async (location: string) => {
    if (!location) {
      setIsLoadingEcoScore(false);
      return;
    }
    setIsLoadingEcoScore(true);
    try {
      const city = location.split(',')[0].trim();
      const cacheKey = `ecoScoreData-${city}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        setEcoScoreData(JSON.parse(cachedData));
        setIsLoadingEcoScore(false);
        return;
      }

      if (city) {
        const result = await predictEcoScore({ location: city });
        setEcoScoreData(result);
        sessionStorage.setItem(cacheKey, JSON.stringify(result));
      }
    } catch (error) {
      console.error('Failed to fetch eco score', error);
      setEcoScoreData(null);
    } finally {
      setIsLoadingEcoScore(false);
    }
  }, []);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      return;
    }

    if (!user) {
      router.push('/login'); // Redirect if not logged in
      return;
    }
    
    const location = userProfile?.location || sessionStorage.getItem('userLocation');

    if (location) {
      fetchEcoScore(location);
    } else {
      // If no location is found anywhere, prompt the user.
      setIsLocationDialogOpen(true);
      setIsLoadingEcoScore(false);
    }
  }, [user, userProfile, isUserLoading, isProfileLoading, fetchEcoScore, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLocationUpdate = async (newLocation: string) => {
    if (!newLocation.trim()) return;

    if (userDocRef) {
      updateDocumentNonBlocking(userDocRef, { location: newLocation });
    }
    sessionStorage.setItem('userLocation', newLocation);
    await fetchEcoScore(newLocation);
    setIsLocationDialogOpen(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const badges = [
    {
      id: 1,
      name: 'Green Warrior',
      icon: Shield,
      color: 'emerald',
      unlocked: true,
      rarity: 'Rare',
    },
    {
      id: 2,
      name: 'Eco Champion',
      icon: Crown,
      color: 'yellow',
      unlocked: true,
      rarity: 'Epic',
    },
    {
      id: 3,
      name: 'Carbon Crusher',
      icon: Zap,
      color: 'blue',
      unlocked: true,
      rarity: 'Common',
    },
    {
      id: 4,
      name: 'Tree Hugger',
      icon: Leaf,
      color: 'green',
      unlocked: true,
      rarity: 'Common',
    },
    {
      id: 5,
      name: 'Water Saver',
      icon: Droplets,
      color: 'cyan',
      unlocked: false,
      rarity: 'Rare',
    },
    {
      id: 6,
      name: 'Air Guardian',
      icon: Wind,
      color: 'purple',
      unlocked: false,
      rarity: 'Epic',
    },
    {
      id: 7,
      name: 'Legend',
      icon: Gem,
      color: 'pink',
      unlocked: false,
      rarity: 'Legendary',
    },
    {
      id: 8,
      name: 'Fire Starter',
      icon: Flame,
      color: 'orange',
      unlocked: false,
      rarity: 'Common',
    },
  ];

  const achievements = [
    {
      title: '15 Day Streak',
      description: 'Logged in for 15 consecutive days',
      progress: 15,
      total: 30,
      icon: Flame,
    },
    {
      title: 'Challenge Master',
      description: 'Complete 50 eco-challenges',
      progress: 38,
      total: 50,
      icon: Target,
    },
    {
      title: 'Social Butterfly',
      description: 'Invite 10 friends',
      progress: 6,
      total: 10,
      icon: Users,
    },
    {
      title: 'Point Collector',
      description: 'Earn 2000 EcoPoints',
      progress: userProfile?.ecoPoints || 0,
      total: 2000,
      icon: Coins,
    },
  ];

  const recentActivities = [
    {
      action: 'Completed Car-Free Day',
      points: 50,
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      action: 'Planted 3 trees',
      points: 75,
      time: '1 day ago',
      icon: Leaf,
      color: 'green',
    },
    {
      action: 'Joined Zero Waste Week',
      points: 100,
      time: '3 days ago',
      icon: Trophy,
      color: 'yellow',
    },
    {
      action: 'Shared on social media',
      points: 10,
      time: '5 days ago',
      icon: Share2,
      color: 'blue',
    },
  ];

  const stats = [
    {
      label: 'EcoPoints',
      value: userProfile?.ecoPoints || 0,
      icon: Coins,
      color: 'yellow',
    },
    { label: 'Rank', value: `#${userRank}`, icon: Trophy, color: 'orange' },
    { label: 'Level', value: 12, icon: Star, color: 'purple' },
    { label: 'Streak', value: `15d`, icon: Flame, color: 'red' },
  ];

  if (isUserLoading || isProfileLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // This check is redundant due to useEffect but good for clarity
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 2}px, ${
              mousePosition.y * 2
            }px)`,
          }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 2}px, ${
              -mousePosition.y * 2
            }px)`,
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <Leaf className="h-8 w-8 text-emerald-400 relative" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                EcoVerse
              </h1>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link href="/profile" className="text-white font-semibold">
                Profile
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <LogActionDialog>
                <Button variant="outline" className="hidden sm:flex bg-white/5 border-white/10 hover:bg-white/10">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Log Action
                </Button>
               </LogActionDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 bg-white/5"
                  >
                    <Avatar className="h-8 w-8">
                      {user?.photoURL ? (
                        <AvatarImage
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                        />
                      ) : (
                        <AvatarImage
                          src={`https://picsum.photos/seed/${user?.uid}/40/40`}
                        />
                      )}
                      <AvatarFallback>
                        {user?.displayName ? (
                          user.displayName.charAt(0).toUpperCase()
                        ) : (
                          <UserIcon />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-900/80 backdrop-blur-xl border-white/10 text-white"
                >
                  <DropdownMenuLabel>
                    {user ? user.displayName : 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => router.push('/profile')}
                    className="cursor-pointer hover:bg-white/10"
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsLocationDialogOpen(true)}
                    className="cursor-pointer hover:bg-white/10"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-white/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                className="md:hidden p-2 bg-white/5 rounded-lg"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8 space-y-8">
        {/* Profile Hero Section */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            transform: `perspective(1000px) rotateX(${
              -mousePosition.y * 0.3
            }deg) rotateY(${mousePosition.x * 0.3}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Cover Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-blue-600/30 to-purple-600/30"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url('https://picsum.photos/seed/profile-bg/1200/400')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <Avatar className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 overflow-hidden bg-slate-800">
                  <AvatarImage
                    src={
                      userProfile?.photoURL ||
                      `https://picsum.photos/seed/${user?.uid}/160/160`
                    }
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback>
                    {userProfile?.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                  <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-8 w-8" />
                  </button>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-4xl font-bold">
                    {userProfile?.displayName}
                  </h2>
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Level {stats.find(s => s.label === 'Level')?.value || 1}
                  </div>
                </div>
                <p className="text-gray-400 mb-4">{userProfile?.email}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    <span>{userProfile?.location || 'Set Location'}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>
                      Joined{' '}
                      {user.metadata.creationTime
                        ? format(new Date(user.metadata.creationTime), 'MMM yyyy')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span>Rank #{userRank}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 hover:bg-white/10"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/5 hover:bg-white/10"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{stat.label}</span>
                    <stat.icon className={`h-4 w-4 text-${stat.color}-400`} />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-x-auto">
          {[
            'overview',
            'leaderboard',
            'badges',
            'achievements',
            'activity',
          ].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Based on Active Tab */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                            <Target className="w-5 h-5" />
                            Weekly Goal Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex flex-col items-center justify-center">
                      <ChartContainer config={{}} className="h-full w-full">
                        <RadialBarChart
                          data={weeklyGoalData}
                          startAngle={-270}
                          endAngle={90}
                          innerRadius="70%"
                          outerRadius="100%"
                          barSize={20}
                        >
                          <PolarAngleAxis
                            type="number"
                            domain={[0, weeklyGoalData[0].goal]}
                            tick={false}
                            angleAxisId={0}
                          />
                          <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                            angleAxisId={0}
                          />
                          <RechartsTooltip content={<ChartTooltipContent />} />
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-white text-3xl font-bold"
                          >
                            {`${(
                              (weeklyGoalData[0].value /
                                weeklyGoalData[0].goal) *
                              100
                            ).toFixed(0)}%`}
                          </text>
                          <text
                            x="50%"
                            y="65%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-muted-foreground text-sm"
                          >
                            of weekly goal
                          </text>
                        </RadialBarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                            <BarChartIcon className="w-5 h-5" />
                            Your Score vs. City Average
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                    <ChartContainer config={{
                        ecoPoints: { label: "Your EcoPoints", color: "hsl(var(--primary))" },
                        ecoScore: { label: "City EcoScore", color: "hsl(var(--accent))" },
                    }} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <div className="flex items-center justify-around h-full">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative h-32 w-32">
                                        <svg className="w-full h-full" viewBox="0 0 36 36">
                                            <path
                                                className="stroke-muted"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="stroke-primary"
                                                strokeDasharray={`${((userProfile?.ecoPoints || 0) / 1000) * 100}, 100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-bold">{userProfile?.ecoPoints || 0}</span>
                                            <span className="text-xs text-muted-foreground">EcoPoints</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">Your EcoPoints</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                     <div className="relative h-32 w-32">
                                        <svg className="w-full h-full" viewBox="0 0 36 36">
                                            <path
                                                className="stroke-muted"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="stroke-accent"
                                                strokeDasharray={`${ecoScoreData?.ecoScore || 0}, 100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-bold">{ecoScoreData?.ecoScore?.toFixed(0) || 'N/A'}</span>
                                            <span className="text-xs text-muted-foreground">EcoScore</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">City EcoScore</span>
                                </div>
                            </div>
                        </ResponsiveContainer>
                    </ChartContainer>
                    </CardContent>
                </Card>
                </div>
                 <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5" />
                      EcoScore Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ChartContainer config={{}} className="h-full w-full">
                      <RechartsAreaChart
                        data={ecoScoreTrendData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorEcoScore"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          domain={[60, 90]}
                        />
                        <RechartsTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="ecoScore"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorEcoScore)"
                        />
                      </RechartsAreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'leaderboard' && <Leaderboard />}

            {activeTab === 'badges' && (
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Badge Collection</h3>
                  <div className="text-sm text-gray-400">
                    {badges.filter(b => b.unlocked).length}/{badges.length}{' '}
                    Unlocked
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.map(badge => (
                    <div
                      key={badge.id}
                      className={`group relative p-6 rounded-2xl border-2 transition-all ${
                        badge.unlocked
                          ? `bg-${badge.color}-500/20 border-${badge.color}-500/50 hover:scale-105 cursor-pointer`
                          : 'bg-white/5 border-white/10 opacity-50'
                      }`}
                    >
                      {!badge.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                          <Lock className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      <div
                        className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-${badge.color}-500 to-${badge.color}-600 rounded-full flex items-center justify-center ${
                          badge.unlocked ? 'group-hover:scale-110' : ''
                        } transition-transform`}
                      >
                        <badge.icon className="h-8 w-8 text-white" />
                      </div>

                      <h4 className="text-center font-bold text-sm mb-1">
                        {badge.name}
                      </h4>
                      <p
                        className={`text-center text-xs text-${badge.color}-400`}
                      >
                        {badge.rarity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-4">
                {achievements.map((achievement, i) => (
                  <div
                    key={i}
                    className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <achievement.icon className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold">{achievement.title}</h4>
                          <span className="text-sm text-gray-400">
                            {achievement.progress}/{achievement.total}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          {achievement.description}
                        </p>

                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-1000"
                            style={{
                              width: `${
                                (achievement.progress / achievement.total) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>

                <div className="space-y-4">
                  {recentActivities.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div
                        className={`w-12 h-12 bg-${activity.color}-500/20 rounded-xl flex items-center justify-center`}
                      >
                        <activity.icon
                          className={`h-6 w-6 text-${activity.color}-400`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold mb-1">
                          {activity.action}
                        </div>
                        <div className="text-sm text-gray-400">
                          {activity.time}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">
                          +{activity.points}
                        </div>
                        <div className="text-xs text-gray-400">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Summary */}
            <div className="p-6 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">Your Impact</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">CO₂ Reduced</span>
                  <span className="font-bold text-emerald-400">125 kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Trees Planted</span>
                  <span className="font-bold text-green-400">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Water Saved</span>
                  <span className="font-bold text-blue-400">450 L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Community Rank</span>
                  <span className="font-bold text-yellow-400">#2</span>
                </div>
              </div>
            </div>

            {/* Streak Calendar */}
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Activity Streak</h3>
                <div className="flex items-center gap-1">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <span className="font-bold text-orange-400">15d</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {[...Array(28)].map((_, i) => {
                  const isActive = i < 15;
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg ${
                        isActive
                          ? 'bg-gradient-to-br from-emerald-500 to-blue-500'
                          : 'bg-white/5'
                      }`}
                    ></div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>

              <div className="space-y-3">
                {[
                  {
                    icon: Heart,
                    label: 'Likes Received',
                    value: '234',
                    color: 'red',
                  },
                  {
                    icon: MessageSquare,
                    label: 'Comments',
                    value: '89',
                    color: 'blue',
                  },
                  {
                    icon: Users,
                    label: 'Friends',
                    value: '156',
                    color: 'purple',
                  },
                  {
                    icon: Gift,
                    label: 'Rewards Claimed',
                    value: '12',
                    color: 'yellow',
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon
                        className={`h-5 w-5 text-${stat.color}-400`}
                      />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <UpdateLocationDialog
        open={isLocationDialogOpen}
        onOpenChange={setIsLocationDialogOpen}
        onLocationSubmit={handleLocationUpdate}
        isLoading={isLoadingEcoScore}
      />
    </div>
  );
}

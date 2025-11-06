
'use client';
import {
  Bot,
  Droplets,
  LayoutDashboard,
  MapPin,
  PlusCircle,
  Thermometer,
  TrendingUp,
  Trophy,
  Users,
  Wind,
  Info,
  LogIn,
  LogOut,
  User as UserIcon,
  Leaf,
  ChevronDown,
  Menu,
  X,
  Bell,
  Settings,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Eye,
  Activity,
  BarChart3,
  Award,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

import { predictEcoScore, type PredictEcoScoreOutput, generateChallenges, type Challenge } from '@/ai/flows';
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

import { LogActionDialog } from '@/components/dashboard/log-action-dialog';
import { Logo } from '@/components/logo';
import { EcoScoreRatingScale } from '@/components/dashboard/ecoscore-rating-scale';
import { useAuth, useUser, useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, doc, limit, orderBy, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';
import { SuggestedChallenges } from '@/components/dashboard/suggested-challenges';
import { FloatingEcoTutor } from '@/components/dashboard/floating-eco-tutor';
import { UpdateLocationDialog } from '@/components/dashboard/update-location-dialog';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { EcoScoreAnalytics } from '@/components/dashboard/ecoscore-analytics';

interface LeaderboardUser {
    id: string;
    displayName: string;
    photoURL: string;
    ecoPoints: number;
}

export default function DashboardPage() {
  const [location, setLocation] = useState('');
  const [ecoScoreData, setEcoScoreData] = useState<PredictEcoScoreOutput | null>(null);
  const [isLoadingEcoScore, setIsLoadingEcoScore] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isLogActionOpen, setIsLogActionOpen] = useState(false);

  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);
  
  const usersCollectionRef = useMemoFirebase(
    () => collection(firestore, 'users'),
    [firestore]
  );
  const leaderboardQuery = useMemoFirebase(
    () =>
      usersCollectionRef
        ? query(usersCollectionRef, orderBy('ecoPoints', 'desc'), limit(5))
        : null,
    [usersCollectionRef]
  );

  const { data: leaderboardData, isLoading: isLeaderboardLoading } =
    useCollection<LeaderboardUser>(leaderboardQuery);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const fetchDashboardData = useCallback(async (loc: string, forceRefresh = false) => {
    const city = loc.split(',')[0].trim();
    
    if (!city) {
      setIsLoadingEcoScore(false);
      setIsLoadingChallenges(false);
      return;
    }
    
    setLocation(loc);

    const ecoScoreCacheKey = `ecoScoreData-${city}`;
    const challengesCacheKey = `challenges-${city}`;

    if (!forceRefresh) {
        const cachedEcoScore = sessionStorage.getItem(ecoScoreCacheKey);
        const cachedChallenges = sessionStorage.getItem(challengesCacheKey);

        if (cachedEcoScore && cachedChallenges) {
            setEcoScoreData(JSON.parse(cachedEcoScore));
            setChallenges(JSON.parse(cachedChallenges));
            setIsLoadingEcoScore(false);
            setIsLoadingChallenges(false);
            return;
        }
    }
    
    setIsLoadingEcoScore(true);
    setIsLoadingChallenges(true);

    try {
      const ecoScorePromise = predictEcoScore({ location: city });
      const challengesPromise = generateChallenges({ location: city, ecoScore: userProfile?.ecoPoints || 75 }); 
      
      const [ecoScoreResult, challengesResult] = await Promise.all([ecoScorePromise, challengesPromise]);

      setEcoScoreData(ecoScoreResult);
      setChallenges(challengesResult.challenges);
      
      sessionStorage.setItem(ecoScoreCacheKey, JSON.stringify(ecoScoreResult));
      sessionStorage.setItem(challengesCacheKey, JSON.stringify(challengesResult.challenges));
      sessionStorage.setItem('userLocation', loc);

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      sessionStorage.removeItem(ecoScoreCacheKey);
      sessionStorage.removeItem(challengesCacheKey);
      setEcoScoreData(null);
      setChallenges([]);
    } finally {
      setIsLoadingEcoScore(false);
      setIsLoadingChallenges(false);
    }
  }, [userProfile?.ecoPoints]);

  useEffect(() => {
    if (isProfileLoading || isUserLoading) {
      return;
    }

    if (!user) {
        return;
    }
    
    const userLocation = userProfile?.location || sessionStorage.getItem('userLocation') || '';
    if (!userLocation) {
        setIsLocationDialogOpen(true);
        setIsLoadingEcoScore(false);
        setIsLoadingChallenges(false);
    } else {
        if(location !== userLocation) {
          fetchDashboardData(userLocation, false);
        }
    }
  }, [user, userProfile, isProfileLoading, isUserLoading, fetchDashboardData, location]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      router.replace('/');
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
    await fetchDashboardData(newLocation, true);
    setIsLocationDialogOpen(false);
  };
  
  const getWeatherIcon = (condition?: string) => {
    if (!condition) return Cloud;
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('mist') || lowerCaseCondition.includes('fog')) return Cloud;
    if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) return CloudRain;
    if (lowerCaseCondition.includes('snow')) return CloudSnow;
    if (lowerCaseCondition.includes('clear')) return Sun;
    return Cloud;
  };

  const WeatherIcon = getWeatherIcon(ecoScoreData?.condition);
  const aqiCategory = ecoScoreData?.aqi ? (ecoScoreData.aqi < 51 ? 'GOOD' : ecoScoreData.aqi < 101 ? 'MODERATE' : 'POOR') : 'N/A';


  if (isUserLoading || isProfileLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white overflow-hidden">
      <UpdateLocationDialog
          open={isLocationDialogOpen}
          onOpenChange={setIsLocationDialogOpen}
          onLocationSubmit={handleLocationUpdate}
          isLoading={isLoadingEcoScore || isLoadingChallenges}
      />
      <LogActionDialog open={isLogActionOpen} onOpenChange={setIsLogActionOpen}>
        <></>
      </LogActionDialog>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)` }}
        ></div>
      </div>

       {/* Header */}
       {!(isLocationDialogOpen || isLogActionOpen) && (
        <header className="relative z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <Leaf className="h-8 w-8 text-emerald-400 relative" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    EcoVerse
                  </h1>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl cursor-pointer" onClick={() => setIsLocationDialogOpen(true)}>
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-white outline-none">{location ? location : 'Set Location'}</span>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" className="hidden sm:flex bg-white/5 border-white/10 hover:bg-white/10" onClick={() => setIsLogActionOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Log Action
                  </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-white/5">
                      <Avatar className="h-8 w-8">
                        {user?.photoURL ? (
                          <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                        ) : (
                          <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/40/40`} />
                        )}
                        <AvatarFallback>
                          {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900/80 backdrop-blur-xl border-white/10 text-white">
                    <DropdownMenuLabel>{user ? user.displayName : 'My Account'}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    {user ? (
                      <>
                        <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer hover:bg-white/10">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsLocationDialogOpen(true)} className="cursor-pointer hover:bg-white/10">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-white/10">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={() => router.push('/login')} className="cursor-pointer hover:bg-white/10">
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Login</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
       )}

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8 space-y-8">
        <div 
          className="relative rounded-3xl overflow-hidden"
          style={{
            transform: `perspective(1000px) rotateX(${-mousePosition.y * 0.3}deg) rotateY(${mousePosition.x * 0.3}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-emerald-900/60 to-slate-800/90 backdrop-blur-sm"></div>
          
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url('https://picsum.photos/seed/dashboard/1200/400')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>

          <div className="relative z-10 p-8 md:p-12">
            {isLoadingEcoScore ? <LoadingSpinner /> : (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{location.split(',')[0].trim() || '...'} Weather Conditions</h2>
                  <p className="text-emerald-400">{ecoScoreData?.suggestion}</p>
                </div>

                <div className="flex items-start gap-8">
                  <div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-7xl md:text-8xl font-bold">{ecoScoreData?.temperature?.toFixed(0)}</span>
                      <span className="text-4xl text-gray-400">°C</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <WeatherIcon className="h-12 w-12 text-blue-400" />
                      <div>
                        <div className="text-xl font-semibold">{ecoScoreData?.condition}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Droplets className="h-4 w-4" />
                      <span>Humidity: {ecoScoreData?.humidity?.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Last Updated: {time.toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="relative mt-8 md:mt-0">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
                  <div 
                    className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => setIsLogActionOpen(true)}
                  >
                    <Leaf className="h-16 w-16 text-white" />
                  </div>
                </div>

                <div className="mt-16 p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Air Quality & EcoScore</h3>
                    <Eye className="h-5 w-5 text-orange-400" />
                  </div>
                  
                  <div className="flex items-baseline justify-around gap-2 mb-4">
                    <div className="text-center">
                        <span className="text-5xl font-bold text-orange-400">{ecoScoreData?.aqi?.toFixed(0)}</span>
                        <span className="text-xl text-gray-400 ml-1">AQI</span>
                    </div>
                     <div className="text-center">
                        <span className="text-5xl font-bold text-emerald-400">{ecoScoreData?.ecoScore?.toFixed(0)}</span>
                         <span className="text-xl text-gray-400 ml-1">EcoScore</span>
                    </div>
                  </div>

                  <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
                    <span className="text-red-400 font-bold">Air quality index is: {aqiCategory}</span>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">EcoScore</span>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{ecoScoreData?.ecoScore.toFixed(0) || '...'}</div>
            <Progress value={ecoScoreData?.ecoScore} indicatorClassName="bg-emerald-500" />
          </div>
          <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">AQI</span>
              <Wind className="h-5 w-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{ecoScoreData?.aqi.toFixed(0) || '...'}</div>
            <Progress value={ecoScoreData ? (ecoScoreData.aqi/500)*100 : 0} indicatorClassName="bg-orange-500" />
          </div>
          <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Humidity</span>
              <Droplets className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{ecoScoreData?.humidity.toFixed(0) || '...'}%</div>
            <Progress value={ecoScoreData?.humidity} indicatorClassName="bg-blue-500" />
          </div>
          <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Temp</span>
              <Thermometer className="h-5 w-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{ecoScoreData?.temperature.toFixed(0) || '...'}°C</div>
            <Progress value={ecoScoreData ? (ecoScoreData.temperature/50)*100 : 0} indicatorClassName="bg-red-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <EcoScoreAnalytics ecoScoreData={ecoScoreData} />
            <SuggestedChallenges challenges={challenges} isLoading={isLoadingChallenges} />
            
            <div className="lg:col-span-2">
              <EcoScoreRatingScale />
            </div>
          </div>

          <div className="space-y-6">
             <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/64/64`} />
                        <AvatarFallback>{userProfile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                    <h4 className="font-bold">{userProfile?.displayName || 'Eco Warrior'}</h4>
                    <p className="text-sm text-gray-400">Level 12</p>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">EcoPoints</span>
                    <span className="font-bold text-yellow-400">{userProfile?.ecoPoints || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Rank</span>
                    <span className="font-bold text-emerald-400">#{leaderboardData?.findIndex(p => p.id === user?.uid) + 1 || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Badges</span>
                    <span className="font-bold">12</span>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Leaderboard</h3>
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              
              <div className="space-y-3">
                {isLeaderboardLoading ? <LoadingSpinner /> : leaderboardData?.map((entry, index) => (
                  <div 
                    key={entry.id}
                    className={`p-3 rounded-lg ${entry.id === user?.uid ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-300 text-black' :
                        index === 2 ? 'bg-orange-500 text-white' : 'bg-slate-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{entry.displayName}</div>
                        <div className="text-xs text-gray-400">{entry.ecoPoints} points</div>
                      </div>
                      <div className="text-lg font-bold">{entry.ecoPoints}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
             <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                 <Button onClick={() => setIsLogActionOpen(true)} variant="ghost" className="w-full flex items-center justify-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm">Log Action</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button onClick={() => router.push('/profile')} variant="ghost" className="w-full flex items-center justify-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group">
                    <UserIcon className="h-5 w-5 text-purple-400" />
                    <span className="text-sm">My Profile & Badges</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button onClick={() => setIsLocationDialogOpen(true)} variant="ghost" className="w-full flex items-center justify-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">Settings</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {location && <FloatingEcoTutor location={location.split(',')[0].trim()} />}
      </main>
    </div>
  );
}

    

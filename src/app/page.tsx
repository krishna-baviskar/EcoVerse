
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
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { LogActionDialog } from '@/components/dashboard/log-action-dialog';
import { OverviewCard } from '@/components/dashboard/overview-card';
import { Logo } from '@/components/logo';
import { EcoScoreRatingScale } from '@/components/dashboard/ecoscore-rating-scale';
import { useAuth, useUser, useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';
import { SuggestedChallenges } from '@/components/dashboard/suggested-challenges';
import { FloatingEcoTutor } from '@/components/dashboard/floating-eco-tutor';

export default function DashboardPage() {
  const [location, setLocation] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [ecoScoreData, setEcoScoreData] = useState<PredictEcoScoreOutput | null>(null);
  const [isLoadingEcoScore, setIsLoadingEcoScore] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const fetchDashboardData = useCallback(async (loc: string) => {
    if (!loc) {
      setIsLoadingEcoScore(false);
      setIsLoadingChallenges(false);
      return;
    }
    
    setIsLoadingEcoScore(true);
    setIsLoadingChallenges(true);

    try {
      if (ecoScoreData && ecoScoreData.location === loc) {
        setIsLoadingEcoScore(false);
        setIsLoadingChallenges(false);
        return;
      }

      const ecoScorePromise = predictEcoScore({ location: loc });
      const ecoScoreResult = await ecoScorePromise;
      setEcoScoreData(ecoScoreResult);

      if (ecoScoreResult.ecoScore) {
        const challengesResult = await generateChallenges({ location: loc, ecoScore: ecoScoreResult.ecoScore });
        setChallenges(challengesResult.challenges);
      } else {
        setChallenges([]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      setEcoScoreData(null);
      setChallenges([]);
    } finally {
      setIsLoadingEcoScore(false);
      setIsLoadingChallenges(false);
    }
  }, [ecoScoreData]);

  useEffect(() => {
    if (userProfile && !hasFetchedInitialData) {
      if (userProfile.location) {
        setLocation(userProfile.location);
        fetchDashboardData(userProfile.location);
      } else {
        setIsLoadingEcoScore(false);
        setIsLoadingChallenges(false);
      }
      setHasFetchedInitialData(true);
    }
  }, [userProfile, hasFetchedInitialData, fetchDashboardData]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLocationChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim() || !userDocRef) return;
    
    const newLocation = locationInput.trim();
    setLocation(newLocation); 
    setLocationInput('');

    updateDocumentNonBlocking(userDocRef, { location: newLocation });

    await fetchDashboardData(newLocation);
  };

  if (isUserLoading || isProfileLoading || (isLoadingEcoScore && !hasFetchedInitialData)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null; // or a login redirect, which is handled by the effect
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" isActive>
                <LayoutDashboard />
                <span className="truncate">Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/leaderboard">
                <SidebarMenuButton>
                  <Trophy />
                  <span className="truncate">Leaderboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/community">
                <SidebarMenuButton>
                  <Users />
                  <span className="truncate">Community</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 p-2 text-sm text-sidebar-foreground/70">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{location || 'Set location'}</span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="shrink-0 md:hidden" />
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">
              Dashboard
            </h1>
          </div>
          <LogActionDialog>
             <Button className="hidden sm:flex" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Log Action
            </Button>
          </LogActionDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                   {user?.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                  ) : (
                    <AvatarImage src="https://picsum.photos/seed/100/40/40" />
                  )}
                  <AvatarFallback>
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user ? user.displayName : 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => router.push('/login')}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Update Location</CardTitle>
                <CardDescription>Enter your city to update your location and EcoScore.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLocationChange} className="flex space-x-2">
                  <Input
                    placeholder="Enter your city"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                  <Button type="submit" disabled={isLoadingEcoScore || isLoadingChallenges}>
                    {(isLoadingEcoScore || isLoadingChallenges) ? 'Updating...' : 'Update'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            {ecoScoreData && !isLoadingEcoScore ? (
               <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Info /> EcoScore Insights
                  </CardTitle>
                  <CardDescription>{ecoScoreData.condition}: {ecoScoreData.suggestion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{ecoScoreData.explanation}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center">
                <CardContent className="p-6">
                  {isLoadingEcoScore ? <Skeleton className="h-4 w-[300px]" /> : <p>Enter a location to see your EcoScore insights.</p>}
                </CardContent>
              </Card>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <OverviewCard
              title="EcoScore"
              value={isLoadingEcoScore ? "..." : ecoScoreData?.ecoScore.toFixed(1) || 'N/A'}
              icon={TrendingUp}
              description={isLoadingEcoScore ? "Calculating..." : `Based on ${location} data`}
            />
             <OverviewCard
              title="AQI"
              value={isLoadingEcoScore ? "..." : ecoScoreData?.aqi.toFixed(0) || 'N/A'}
              icon={Wind}
              description="Air Quality Index"
            />
            <OverviewCard
              title="Humidity"
              value={isLoadingEcoScore ? "..." : `${ecoScoreData?.humidity.toFixed(0) || 'N/A'}%`}
              icon={Droplets}
              description="Relative Humidity"
            />
            <OverviewCard
              title="Temperature"
              value={isLoadingEcoScore ? "..." : `${ecoScoreData?.temperature.toFixed(0) || 'N/A'}°C`}
              icon={Thermometer}
              description="Current temperature"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
             <SuggestedChallenges 
                challenges={challenges} 
                isLoading={isLoadingChallenges}
             />
          </div>
          
          <div className="grid gap-4 lg:grid-cols-1">
              <EcoScoreRatingScale />
          </div>
        </main>
        {location && <FloatingEcoTutor location={location} />}
      </SidebarInset>
    </SidebarProvider>
  );
}

    

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
import { UpdateLocationDialog } from '@/components/dashboard/update-location-dialog';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { CommunityImpact } from '@/components/dashboard/community-impact';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function DashboardPage() {
  const [location, setLocation] = useState('');
  const [ecoScoreData, setEcoScoreData] = useState<PredictEcoScoreOutput | null>(null);
  const [isLoadingEcoScore, setIsLoadingEcoScore] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);


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

  const fetchDashboardData = useCallback(async (loc: string, forceRefresh = false) => {
    const locationParts = loc.split(',').map(p => p.trim());
    // Find the city. It's usually the second part if an address is present, or the first otherwise.
    const fetchCity = locationParts.length > 1 ? locationParts[1] : locationParts[0];
    
    if (!fetchCity) {
      setIsLoadingEcoScore(false);
      setIsLoadingChallenges(false);
      return;
    }
    
    setLocation(loc); // Set the full location string for display

    const ecoScoreCacheKey = `ecoScoreData-${fetchCity}`;
    const challengesCacheKey = `challenges-${fetchCity}`;

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
      const ecoScorePromise = predictEcoScore({ location: fetchCity });
      // Use a default ecoScore for challenge generation to avoid dependency on the predictEcoScore result
      const challengesPromise = generateChallenges({ location: fetchCity, ecoScore: 75 }); 
      
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
  }, []);

  useEffect(() => {
    if (isProfileLoading || isUserLoading) {
      return;
    }

    if (!user) {
        // Redirect handled by another effect
        return;
    }
    
    const userLocation = userProfile?.location || sessionStorage.getItem('userLocation') || '';
    if (!userLocation) {
        setIsLocationDialogOpen(true);
        setIsLoadingEcoScore(false);
        setIsLoadingChallenges(false);
    } else {
        fetchDashboardData(userLocation, false);
    }
  }, [user, userProfile, isProfileLoading, isUserLoading, fetchDashboardData]);


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

    await fetchDashboardData(newLocation, true);
  };

  if (isUserLoading || isProfileLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return null; // or a login redirect, which is handled by the effect
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base flex-shrink-0">
            <Logo />
            <span className="sr-only">EcoVerse</span>
          </Link>
          <div className="flex-grow min-w-0">
            {location ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>No location set</span>
              </div>
            )}
          </div>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:w-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial">
                 <LogActionDialog>
                    <Button className="hidden sm:flex" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Log Action
                    </Button>
                </LogActionDialog>
            </div>
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
                  <DropdownMenuItem onClick={() => setIsLocationDialogOpen(true)}>
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
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <UpdateLocationDialog
          open={isLocationDialogOpen}
          onOpenChange={setIsLocationDialogOpen}
          onLocationSubmit={handleLocationUpdate}
          isLoading={isLoadingEcoScore || isLoadingChallenges}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Location Settings</CardTitle>
                <CardDescription>
                  Your location is used to calculate your EcoScore and find local challenges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsLocationDialogOpen(true)}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Update Location
                </Button>
              </CardContent>
            </Card>
            {ecoScoreData && !isLoadingEcoScore ? (
               <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Info /> EcoScore Insights for {location.split(',')[0].trim()}
                  </CardTitle>
                  <CardDescription>{ecoScoreData.condition}: {ecoScoreData.suggestion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{ecoScoreData.explanation}</p>
                  <Separator className="my-4" />
                  <h4 className="font-semibold mb-2 text-sm">Score Breakdown:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {ecoScoreData.breakdown.map((item) => (
                        <li key={item.factor} className="flex justify-between items-center">
                            <span>{item.factor} ({item.rawValue}):</span>
                            <span className="font-medium text-foreground">{item.contribution.toFixed(1)} pts</span>
                        </li>
                    ))}
                  </ul>
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
              description={isLoadingEcoScore ? "Calculating..." : `Based on location data`}
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
        {location && <FloatingEcoTutor location={location.split(',')[0].trim()} />}
      </div>
  );
}

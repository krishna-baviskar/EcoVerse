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
import { useEffect, useState } from 'react';

import { predictEcoScore, type PredictEcoScoreOutput } from '@/ai/flows';
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
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [location, setLocation] = useState('Greenville');
  const [locationInput, setLocationInput] = useState('');
  const [ecoScoreData, setEcoScoreData] = useState<PredictEcoScoreOutput | null>(null);
  const [isLoadingEcoScore, setIsLoadingEcoScore] = useState(true);
  const router = useRouter();

  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

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
    if (locationInput.trim()) {
      const newLocation = locationInput.trim();
      setLocation(newLocation);
      setLocationInput('');
      await updateEcoScore(newLocation);
    }
  };

  const updateEcoScore = async (loc: string) => {
    setIsLoadingEcoScore(true);
    try {
      const result = await predictEcoScore({ location: loc });
      setEcoScoreData(result);
    } catch (error) {
      console.error("Failed to predict ecoscore", error);
    } finally {
      setIsLoadingEcoScore(false);
    }
  }

  useEffect(() => {
    if(user) {
      updateEcoScore(location);
    }
  }, [user]);

  if (isUserLoading || !user) {
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
    )
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
              <Link href="/eco-gpt-tutor">
                <SidebarMenuButton>
                  <Bot />
                  <span className="truncate">EcoGPT Tutor</span>
                </SidebarMenuButton>
              </Link>
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
            <span className="truncate">{location}</span>
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
                  <Button type="submit" disabled={isLoadingEcoScore}>
                    {isLoadingEcoScore ? 'Updating...' : 'Update'}
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
                  <p>Enter a location to see your EcoScore insights.</p>
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
          
          <div className="grid gap-4 lg:grid-cols-1">
              <EcoScoreRatingScale />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

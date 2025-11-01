'use client';
import {
  Award,
  Bot,
  Coins,
  LayoutDashboard,
  MapPin,
  PlusCircle,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { EcoscoreTrendChart } from '@/components/dashboard/ecoscore-trend-chart';
import { Leaderboard } from '@/components/dashboard/leaderboard';
import { LogActionDialog } from '@/components/dashboard/log-action-dialog';
import { OverviewCard } from '@/components/dashboard/overview-card';
import { Logo } from '@/components/logo';

export default function DashboardPage() {
  const [location, setLocation] = useState('Greenville');
  const [locationInput, setLocationInput] = useState('');

  const handleLocationChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      setLocation(locationInput.trim());
      setLocationInput('');
    }
  };

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
              <SidebarMenuButton href="/eco-gpt-tutor">
                <Bot />
                <span className="truncate">EcoGPT Tutor</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Trophy />
                <span className="truncate">Leaderboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Users />
                <span className="truncate">Community</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
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
                  <AvatarImage src="https://picsum.photos/seed/100/40/40" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Update Location</CardTitle>
                <CardDescription>Enter your city to update your location.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLocationChange} className="flex space-x-2">
                  <Input
                    placeholder="Enter your city"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                  <Button type="submit">Update</Button>
                </form>
              </CardContent>
            </Card>
            <EcoscoreTrendChart />
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <OverviewCard
              title="EcoScore"
              value="850"
              icon={TrendingUp}
              description="+20.1% from last month"
            />
            <OverviewCard
              title="Eco-Points"
              value="12,530"
              icon={Coins}
              description="+180.1 from last week"
            />
            <OverviewCard
              title="Community Rank"
              value="#12"
              icon={Award}
              description="Top 5% in your city"
            />
            <OverviewCard
              title="Location"
              value={location}
              icon={MapPin}
              description="Your current location"
            />
          </div>
          
          <div className="mt-4">
            <Leaderboard />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

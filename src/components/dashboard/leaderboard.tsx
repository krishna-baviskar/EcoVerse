'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import type { User } from '@/lib/types';

const leaderboardData: User[] = [
    { rank: 1, name: 'EcoWarrior', ecoscore: 980, city: 'Greenville', avatar: 'https://picsum.photos/seed/1/40/40' },
    { rank: 2, name: 'SustainablySam', ecoscore: 965, city: 'Riverside', avatar: 'https://picsum.photos/seed/2/40/40' },
    { rank: 3, name: 'PlanetPatty', ecoscore: 950, city: 'Greenville', avatar: 'https://picsum.photos/seed/3/40/40' },
    { rank: 4, name: 'RecycleRick', ecoscore: 920, city: 'Metropolis', avatar: 'https://picsum.photos/seed/4/40/40' },
    { rank: 12, name: 'You', ecoscore: 850, city: 'Metropolis', avatar: 'https://picsum.photos/seed/100/40/40', isCurrentUser: true },
    { rank: 13, name: 'CompostClara', ecoscore: 845, city: 'Riverside', avatar: 'https://picsum.photos/seed/5/40/40' },
];

export function Leaderboard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Trophy /> Community Leaderboard
        </CardTitle>
        <CardDescription>See how you stack up against others in the community.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>EcoScore</TableHead>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.sort((a, b) => a.rank - b.rank).map((user) => (
              <TableRow key={user.rank} className={user.isCurrentUser ? 'bg-primary/10' : ''}>
                <TableCell className="font-medium">{user.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                     {user.rank <= 3 && <Badge variant={user.rank === 1 ? 'default' : 'secondary'} className="ml-2">Top {user.rank}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-primary">{user.ecoscore}</TableCell>
                <TableCell>{user.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

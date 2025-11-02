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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useUser } from '@/firebase';

interface LeaderboardUser {
  id: string;
  displayName: string;
  photoURL: string;
  ecoPoints: number;
}

export function Leaderboard() {
  const firestore = useFirestore();
  const { user } = useUser();

  const usersCollectionRef = useMemoFirebase(
    () => collection(firestore, 'users'),
    [firestore]
  );
  const leaderboardQuery = useMemoFirebase(
    () =>
      usersCollectionRef
        ? query(usersCollectionRef, orderBy('ecoPoints', 'desc'), limit(10))
        : null,
    [usersCollectionRef]
  );

  const { data: leaderboardData, isLoading } =
    useCollection<LeaderboardUser>(leaderboardQuery);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Trophy /> Community Leaderboard
        </CardTitle>
        <CardDescription>
          See how you stack up against others in the community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>EcoScore</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData &&
                leaderboardData.map((leaderboardUser, index) => (
                  <TableRow
                    key={leaderboardUser.id}
                    className={
                      user && leaderboardUser.id === user.uid
                        ? 'bg-primary/10'
                        : ''
                    }
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              leaderboardUser.photoURL ||
                              `https://picsum.photos/seed/${leaderboardUser.id}/40/40`
                            }
                            alt={leaderboardUser.displayName}
                          />
                          <AvatarFallback>
                            {leaderboardUser.displayName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {leaderboardUser.displayName}
                          {user && leaderboardUser.id === user.uid ? ' (You)' : ''}
                        </span>
                        {index < 3 && (
                          <Badge
                            variant={index === 0 ? 'default' : 'secondary'}
                            className="ml-2"
                          >
                            Top {index + 1}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {leaderboardUser.ecoPoints}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

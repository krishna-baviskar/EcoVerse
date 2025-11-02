'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, PlusCircle } from "lucide-react";
import type { Challenge } from "@/ai/flows";

interface SuggestedChallengesProps {
  challenges: Challenge[];
  isLoading: boolean;
  onLogChallenge: (challenge: { title: string; ecoPoints: number }) => void;
}

export function SuggestedChallenges({ challenges, isLoading, onLogChallenge }: SuggestedChallengesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Lightbulb /> Suggested Challenges
        </CardTitle>
        <CardDescription>
          Complete these personalized challenges to earn more EcoPoints.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        ) : challenges.length > 0 ? (
          <div className="space-y-3">
            {challenges.map((challenge, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card-foreground/5">
                <div className="flex-grow">
                  <h4 className="font-semibold">{challenge.title}</h4>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold text-primary text-lg">{challenge.ecoPoints} pts</span>
                    <LogActionDialog challenge={challenge}>
                        <Button size="sm" variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Log
                        </Button>
                    </LogActionDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No challenges available right now. Update your location to get new suggestions.</p>
        )}
      </CardContent>
    </Card>
  );
}

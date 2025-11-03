'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Lightbulb, Info } from "lucide-react";
import type { Challenge } from "@/ai/flows";
import { ChallengeDetailDialog } from './challenge-detail-dialog';
import { LogActionDialog } from './log-action-dialog';

interface SuggestedChallengesProps {
  challenges: Challenge[];
  isLoading: boolean;
}

export function SuggestedChallenges({ challenges, isLoading }: SuggestedChallengesProps) {
  const [selectedChallengeForDetail, setSelectedChallengeForDetail] = useState<Challenge | null>(null);
  const [selectedChallengeToLog, setSelectedChallengeToLog] = useState<Challenge | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);


  const handleViewDetails = (challenge: Challenge) => {
    setSelectedChallengeForDetail(challenge);
    setIsDetailOpen(true);
  };

  const handleStartChallenge = (challenge: Challenge) => {
    setSelectedChallengeToLog(challenge);
    setIsLogOpen(true);
  };

  return (
    <>
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
                  <Skeleton className="h-6 w-20" />
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
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className="font-bold text-primary text-lg">{challenge.ecoPoints} pts</span>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(challenge)}>
                        <Info className="mr-2 h-4 w-4" />
                        Details
                    </Button>
                     <Button size="sm" onClick={() => handleStartChallenge(challenge)}>
                        Start Challenge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No challenges available right now. Update your location to get new suggestions.</p>
          )}
        </CardContent>
      </Card>
      
      <ChallengeDetailDialog 
        challenge={selectedChallengeForDetail}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
      
      <LogActionDialog
        challenge={selectedChallengeToLog}
        open={isLogOpen}
        onOpenChange={setIsLogOpen}
      >
        {/* The trigger is handled programmatically, so this is empty */}
        <></>
      </LogActionDialog>
    </>
  );
}

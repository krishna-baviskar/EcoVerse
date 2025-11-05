'use client';

import React, { useState } from 'react';
import { Lightbulb, Zap, Award, TrendingUp, Sparkles, Lock } from 'lucide-react';
import { type Challenge } from '@/ai/flows';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LogActionDialog } from './log-action-dialog';
import { ChallengeDetailDialog } from './challenge-detail-dialog';


const difficultyColors: Record<string, { bg: string, glow: string }> = {
  easy: { bg: 'from-green-500 to-emerald-500', glow: 'rgba(16, 185, 129, 0.4)' },
  medium: { bg: 'from-amber-500 to-orange-500', glow: 'rgba(245, 158, 11, 0.4)' },
  hard: { bg: 'from-purple-500 to-pink-500', glow: 'rgba(168, 85, 247, 0.4)' }
};

interface SuggestedChallengesProps {
  challenges: Challenge[];
  isLoading: boolean;
}

export function SuggestedChallenges({ challenges, isLoading }: SuggestedChallengesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isLogActionOpen, setIsLogActionOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);


  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsDetailOpen(true);
  };
  
  const handleLogAction = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsLogActionOpen(true);
  };


  return (
    <>
      <ChallengeDetailDialog
        challenge={selectedChallenge}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
       <LogActionDialog
        challenge={selectedChallenge}
        open={isLogActionOpen}
        onOpenChange={setIsLogActionOpen}
      >
        <></>
      </LogActionDialog>

      <div className="relative w-full max-w-full">
        <div 
          className="relative group"
          style={{
            perspective: '2000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"
            style={{ transform: 'translateZ(-50px)' }}
          ></div>

          <Card
            className="relative bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-500"
            style={{
              boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.2), inset 0 1px 0 0 rgba(255,255,255,0.05)',
              transform: 'translateZ(0)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"></div>

            <CardHeader className="relative p-8 pb-6 border-b border-white/5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div 
                      className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300"
                      style={{
                        boxShadow: '0 10px 40px rgba(251, 191, 36, 0.3)'
                      }}
                    >
                      <Lightbulb className="w-7 h-7 text-white animate-pulse" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping opacity-50"></div>
                    </div>
                    
                    <div>
                      <CardTitle className="text-3xl font-bold text-white">
                        Suggested Challenges
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <CardDescription className="text-sm text-gray-400">
                          Complete these personalized challenges to earn more EcoPoints
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm">
                  <Award className="w-5 h-5 text-blue-400" />
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Available</div>
                    <div className="text-lg font-bold text-white">{isLoading ? '...' : challenges.length}</div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative p-8">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="relative p-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                    >
                      <div className="flex items-center justify-between animate-pulse">
                        <div className="flex-1">
                          <div className="h-6 w-3/4 bg-white/10 rounded-lg mb-3"></div>
                          <div className="h-4 w-full bg-white/5 rounded-lg"></div>
                        </div>
                        <div className="h-12 w-28 bg-white/10 rounded-lg ml-4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : challenges.length > 0 ? (
                <div className="space-y-4">
                  {challenges.map((challenge, index) => {
                    const difficulty = difficultyColors[challenge.difficulty] || difficultyColors.medium;
                    const isHovered = hoveredIndex === index;

                    return (
                      <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`relative group/card transition-all duration-300 ${ isHovered ? 'scale-[1.02]' : '' }`}
                      >
                        {isHovered && (
                          <div 
                            className={`absolute inset-0 bg-gradient-to-r ${difficulty.bg} rounded-2xl blur-xl opacity-30 transition-opacity duration-300`}
                          ></div>
                        )}

                        <div 
                          className={`relative p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border transition-all duration-300 overflow-hidden border-white/10 hover:border-white/20`}
                          style={{
                            boxShadow: isHovered 
                              ? `0 20px 60px -10px ${difficulty.glow}, inset 0 1px 0 rgba(255,255,255,0.1)` 
                              : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                          }}
                        >
                          {isHovered && (
                            <div className={`absolute inset-0 bg-gradient-to-r ${difficulty.bg} opacity-5`}></div>
                          )}

                          <div 
                              onClick={() => handleChallengeClick(challenge)}
                              className="absolute top-4 right-4 flex items-center gap-2 cursor-pointer"
                           >
                            <span 
                              className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${difficulty.bg} text-white shadow-lg`}
                              style={{ boxShadow: `0 4px 20px ${difficulty.glow}` }}
                            >
                              {(challenge.difficulty || 'medium').toUpperCase()}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div 
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${difficulty.bg} flex items-center justify-center shadow-lg transition-transform duration-300 shrink-0 ${ isHovered ? 'scale-110 rotate-12' : '' }`}
                              style={{ boxShadow: `0 8px 25px ${difficulty.glow}` }}
                            >
                              <Zap className="w-6 h-6 text-white" />
                            </div>

                            <div className="flex-1 min-w-0" onClick={() => handleChallengeClick(challenge)}>
                              <h4 className="font-bold text-lg text-white mb-1">
                                {challenge.title}
                              </h4>
                              <p className="text-sm text-gray-400 leading-relaxed">
                                {challenge.description}
                              </p>
                            </div>
                            
                            <div 
                                onClick={() => handleLogAction(challenge)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br ${difficulty.bg} shadow-xl transition-all duration-300 cursor-pointer ${ isHovered ? 'scale-105' : 'scale-100' }`}
                                style={{ boxShadow: `0 10px 30px ${difficulty.glow}` }}
                             >
                              <Award className="w-5 h-5 text-white" />
                              <div className="text-right">
                                <div className="text-xs text-white/80 font-medium">REWARD</div>
                                <div className="text-2xl font-bold text-white whitespace-nowrap">
                                  {challenge.ecoPoints}
                                </div>
                                <div className="text-xs text-white/80">points</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Challenges Available</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Update your location to get personalized eco-challenges tailored to your area.
                  </p>
                  <button className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Update Location
                  </button>
                </div>
              )}

              {challenges.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                      <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {challenges.reduce((sum, c) => sum + c.ecoPoints, 0)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Total Points</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                      <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{challenges.length}</div>
                      <div className="text-xs text-gray-400 mt-1">Active Challenges</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                      <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">0</div>
                      <div className="text-xs text-gray-400 mt-1">Completed</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          </Card>
        </div>
      </div>
    </>
  );
}

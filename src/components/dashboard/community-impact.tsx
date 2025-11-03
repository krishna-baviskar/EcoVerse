'use client';
import { BarChart, PieChart, Users, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

interface CommunityImpactProps {
  userEcoPoints: number;
  cityEcoScore: number;
  isLoading: boolean;
}

const WEEKLY_COMMUNITY_GOAL = 1000; // Arbitrary goal for visualization

export function CommunityImpact({ userEcoPoints, cityEcoScore, isLoading }: CommunityImpactProps) {
  
  const contributionPercentage = Math.min((userEcoPoints / WEEKLY_COMMUNITY_GOAL) * 100, 100);

  const radialChartData = [
    { name: 'Contribution', value: contributionPercentage, fill: 'hsl(var(--primary))' },
  ];

  const barChartData = [
    { name: 'Scores', 'Your EcoPoints': userEcoPoints, 'City EcoScore': cityEcoScore },
  ];
  
  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-60 w-full" />
                <Skeleton className="h-60 w-full" />
            </CardContent>
        </Card>
    )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Users /> Community Impact
        </CardTitle>
        <CardDescription>
          See how your actions contribute to your community's goals and compare with your city's EcoScore.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="font-semibold text-center mb-2 flex items-center justify-center gap-2">
            <PieChart className="w-5 h-5" />
            Your Contribution to Weekly Goal
          </h3>
          <ChartContainer config={{}} className="mx-auto aspect-square h-60">
            <RadialBarChart
              data={radialChartData}
              startAngle={90}
              endAngle={-270}
              innerRadius="70%"
              outerRadius="110%"
              barSize={20}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                background={{ fill: 'hsl(var(--muted))' }}
              />
              <Tooltip
                content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    return (
                        <div className="bg-background border rounded-md p-2 text-sm shadow-lg">
                            <p className="font-bold">{`${payload[0].value?.toFixed(0)}%`}</p>
                            <p className="text-muted-foreground">of weekly goal</p>
                        </div>
                    );
                }}
              />
               <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">
                {`${userEcoPoints}`}
              </text>
              <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">
                / {WEEKLY_COMMUNITY_GOAL} pts
              </text>
            </RadialBarChart>
          </ChartContainer>
        </div>
        <div>
          <h3 className="font-semibold text-center mb-2 flex items-center justify-center gap-2">
            <BarChart className="w-5 h-5"/>
            Score Comparison
          </h3>
           <ChartContainer config={{}} className="h-60 w-full">
            <RechartsBarChart data={barChartData} accessibilityLayer>
                <XAxis dataKey="name" tickLine={false} axisLine={false} hide/>
                <YAxis />
                <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))', radius: 4}}
                    content={<ChartTooltipContent />} 
                />
                <Legend />
                <Bar 
                    dataKey="Your EcoPoints" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                />
                <Bar 
                    dataKey="City EcoScore" 
                    fill="hsl(var(--accent))" 
                    radius={[4, 4, 0, 0]}
                />
            </RechartsBarChart>
           </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

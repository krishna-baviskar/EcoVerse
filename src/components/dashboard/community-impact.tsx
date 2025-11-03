'use client';
import {
  BarChart,
  Users,
  LineChart,
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  CartesianGrid,
  RadialBarChart,
  PolarAngleAxis,
  RadialBar,
} from 'recharts';
import { DayContent, DayContentProps } from 'react-day-picker';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format, isSameDay, startOfWeek, eachDayOfInterval, subDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CommunityImpactProps {
  userEcoPoints: number;
  cityEcoScore: number;
  isLoading: boolean;
}

// MOCK DATA for new charts
const lineChartData = [
  { date: 'Mon', points: 20 },
  { date: 'Tue', points: 35 },
  { date: 'Wed', points: 30 },
  { date: 'Thu', points: 50 },
  { date: 'Fri', points: 45 },
  { date: 'Sat', points: 60 },
  { date: 'Sun', points: 75 },
];

const ecoScoreTrendData = [
  { month: 'Jan', ecoScore: 65 },
  { month: 'Feb', ecoScore: 68 },
  { month: 'Mar', ecoScore: 72 },
  { month: 'Apr', ecoScore: 70 },
  { month: 'May', ecoScore: 75 },
  { month: 'Jun', ecoScore: 78 },
];

const activityHeatmapData: Record<string, number> = {};
for (let i = 0; i < 90; i++) {
  if (Math.random() > 0.3) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    activityHeatmapData[date] = Math.floor(Math.random() * 5) + 1;
  }
}

const weeklyGoalData = [
    { name: 'Weekly Goal', value: 450, goal: 1000, fill: 'hsl(var(--primary))' },
];


const getActivityColor = (level: number | undefined) => {
    if (level === undefined) return 'bg-muted/50';
    const colors = [
      'bg-primary/20',
      'bg-primary/40',
      'bg-primary/60',
      'bg-primary/80',
      'bg-primary',
    ];
    return colors[level - 1] || 'bg-muted/50';
};
  

const ActivityHeatmap = () => {
    const today = new Date();
    const endDate = today;
    const startDate = subDays(endDate, 89); // Approx 3 months
  
    const days = eachDayOfInterval({ start: startDate, end: endDate });
  
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
    return (
        <TooltipProvider>
            <div className="flex gap-3 text-xs">
                <div className="flex flex-col gap-1 text-muted-foreground">
                    {weekDays.map(day => <div key={day} className="h-4 leading-4">{day}</div>).filter((_, i) => i % 2 !== 0)}
                </div>
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                    {days.map(day => {
                    const dateString = format(day, 'yyyy-MM-dd');
                    const activityLevel = activityHeatmapData[dateString];
                    return (
                        <Tooltip key={dateString}>
                        <TooltipTrigger asChild>
                            <div className={cn("h-4 w-4 rounded-sm", getActivityColor(activityLevel))} />
                        </TooltipTrigger>
                        <TooltipContent>
                            {activityLevel ? `${activityLevel} actions` : 'No actions'} on {format(day, 'MMM d, yyyy')}
                        </TooltipContent>
                        </Tooltip>
                    );
                    })}
                </div>
            </div>
      </TooltipProvider>
    );
};


export function CommunityImpact({
  userEcoPoints,
  cityEcoScore,
  isLoading,
}: CommunityImpactProps) {

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
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Users /> Community Impact
        </CardTitle>
        <CardDescription>
          Visualize your contributions and track your progress alongside the community.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart 1: Radial Bar Chart for Weekly Goal */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Weekly Goal Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex flex-col items-center justify-center">
                <ChartContainer config={{}} className="h-full w-full">
                    <RadialBarChart 
                        data={weeklyGoalData}
                        startAngle={-270}
                        endAngle={90}
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={20}
                    >
                        <PolarAngleAxis type="number" domain={[0, weeklyGoalData[0].goal]} tick={false} angleAxisId={0} />
                        <RadialBar 
                            background 
                            dataKey="value" 
                            cornerRadius={10}
                            angleAxisId={0}
                        />
                        <RechartsTooltip content={<ChartTooltipContent />} />
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-3xl font-bold"
                        >
                            {`${((weeklyGoalData[0].value / weeklyGoalData[0].goal) * 100).toFixed(0)}%`}
                        </text>
                         <text
                            x="50%"
                            y="65%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-muted-foreground text-sm"
                        >
                            of weekly goal
                        </text>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>


        {/* Chart 2: Area Chart for EcoScore Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                EcoScore Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ChartContainer config={{}} className="h-full w-full">
              <RechartsAreaChart data={ecoScoreTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorEcoScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[60, 90]}/>
                <RechartsTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="ecoScore" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorEcoScore)" />
              </RechartsAreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Chart 3: Activity Heatmap */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Activity Heatmap
                </CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center overflow-x-auto p-4">
               <ActivityHeatmap />
            </CardContent>
        </Card>

        
        {/* Chart 4: Bar Chart for Score Comparison */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Your Score vs. City Average
                </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                <ChartContainer config={{}} className="h-full w-full">
                    <RechartsBarChart data={barChartData} accessibilityLayer layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} hide/>
                        <RechartsTooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={<ChartTooltipContent />}
                        />
                        <Legend />
                        <Bar
                            dataKey="Your EcoPoints"
                            fill="hsl(var(--primary))"
                            radius={[0, 4, 4, 0]}
                            barSize={30}
                        />
                        <Bar
                            dataKey="City EcoScore"
                            fill="hsl(var(--accent))"
                            radius={[0, 4, 4, 0]}
                             barSize={30}
                        />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>

      </CardContent>
    </Card>
  );
}

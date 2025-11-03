'use client';
import {
  BarChart,
  Users,
  LineChart,
  Calendar as CalendarIcon,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
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
import { addDays, format, isSameDay } from 'date-fns';

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

const activityHeatmapData: Record<string, number> = {
    [format(new Date(), 'yyyy-MM-dd')]: 5,
    [format(addDays(new Date(), -1), 'yyyy-MM-dd')]: 3,
    [format(addDays(new Date(), -2), 'yyyy-MM-dd')]: 4,
    [format(addDays(new Date(), -4), 'yyyy-MM-dd')]: 1,
    [format(addDays(new Date(), -5), 'yyyy-MM-dd')]: 2,
    [format(addDays(new Date(), -10), 'yyyy-MM-dd')]: 5,
};

const weeklyGoalData = [
    { name: 'Weekly Goal', value: 450, goal: 1000, fill: 'hsl(var(--primary))' },
];


const CustomDay = (props: DayContentProps) => {
    const { date } = props;
    let backgroundColor = 'transparent';
  
    // Find if the current date has activity
    const activityEntry = Object.entries(activityHeatmapData).find(([d]) =>
      isSameDay(new Date(d.replace(/-/g, '/')), date)
    );
  
    if (activityEntry) {
      const level = activityEntry[1];
      // We use hsla with the primary color's HSL values to create a heatmap effect.
      backgroundColor = `hsla(123, 44%, 38%, ${level * 0.18})`;
    }
  
    return (
      <span
        className="relative flex h-full w-full items-center justify-center rounded-md"
        style={{ backgroundColor }}
      >
        <DayContent {...props} />
      </span>
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
                        <Tooltip content={<ChartTooltipContent />} />
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


        {/* Chart 2: Line Chart for Weekly Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Your Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ChartContainer config={{}} className="h-full w-full">
              <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="points" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Activity Heatmap Calendar */}
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Activity Heatmap
                </CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex justify-center">
                <Calendar
                    mode="single"
                    selected={new Date()}
                    className="p-0"
                    components={{
                        Day: CustomDay
                    }}
                />
            </CardContent>
        </Card>
        
        {/* Chart 4: Bar Chart for Score Comparison */}
        <Card className="lg:col-span-2">
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
                        <Tooltip
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

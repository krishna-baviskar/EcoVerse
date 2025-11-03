'use client';
import {
  BarChart,
  PieChart,
  Users,
  TrendingUp,
  LineChart,
  Donut,
  Recycle,
  Lightbulb,
  Train,
  Calendar as CalendarIcon,
} from 'lucide-react';
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
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
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
import { Calendar } from '@/components/ui/calendar';
import { addDays, format } from 'date-fns';

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

const pieChartData = [
  { name: 'Recycling', value: 400, icon: Recycle, fill: 'hsl(var(--chart-1))' },
  { name: 'Energy Saving', value: 300, icon: Lightbulb, fill: 'hsl(var(--chart-2))' },
  { name: 'Sustainable Transit', value: 300, icon: Train, fill: 'hsl(var(--chart-3))' },
  { name: 'Other', value: 200, icon: Users, fill: 'hsl(var(--chart-4))' },
];

const activityHeatmapData = {
    [format(new Date(), 'yyyy-MM-dd')]: 5,
    [format(addDays(new Date(), -1), 'yyyy-MM-dd')]: 3,
    [format(addDays(new Date(), -2), 'yyyy-MM-dd')]: 4,
    [format(addDays(new Date(), -4), 'yyyy-MM-dd')]: 1,
    [format(addDays(new Date(), -5), 'yyyy-MM-dd')]: 2,
    [format(addDays(new Date(), -10), 'yyyy-M-dd')]: 5,
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

        {/* Chart 1: Line Chart for Weekly Progress */}
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

        {/* Chart 2: Activity Heatmap Calendar */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Activity Heatmap
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-64">
                <Calendar
                    mode="single"
                    selected={new Date()}
                    className="p-0"
                    modifiers={{
                        activity: Object.keys(activityHeatmapData).map(dateStr => new Date(dateStr.replace(/-/g, '/'))),
                    }}
                    modifiersClassNames={{
                        activity: 'bg-primary/20',
                    }}
                    styles={{
                        day: {
                            // This is a bit of a hack to color days based on activity level.
                            // A proper implementation would use a custom day renderer.
                            ...Object.fromEntries(
                                Object.entries(activityHeatmapData).map(([date, level]) => [
                                    `[aria-label="${format(new Date(date.replace(/-/g, '/')), 'PPP')}"]`, { backgroundColor: `hsla(var(--primary-hsl) / ${level * 0.2})` }
                                ])
                            )
                        },
                    }}
                />
            </CardContent>
        </Card>

        {/* Chart 3: Donut Chart for Contribution by Type */}
        <Card>
          <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
                <Donut className="w-5 h-5" />
                Contribution by Action Type
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
             <ChartContainer config={{}} className="h-full w-full">
                <RechartsPieChart>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius="60%" >
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Legend iconType='circle' layout="vertical" verticalAlign="middle" align="right" />
                </RechartsPieChart>
             </ChartContainer>
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

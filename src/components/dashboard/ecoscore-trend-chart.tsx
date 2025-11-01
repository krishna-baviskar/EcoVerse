'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

const chartData = [
  { month: 'January', ecoscore: 680 },
  { month: 'February', ecoscore: 705 },
  { month: 'March', ecoscore: 750 },
  { month: 'April', ecoscore: 780 },
  { month: 'May', ecoscore: 820 },
  { month: 'June', ecoscore: 850 },
];

const chartConfig = {
  ecoscore: {
    label: 'EcoScore',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export function EcoscoreTrendChart() {
  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <TrendingUp /> EcoScore Trend
        </CardTitle>
        <CardDescription>Your EcoScore progress over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
                domain={[600, 900]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillEcoscore" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ecoscore)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ecoscore)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="ecoscore"
              type="natural"
              fill="url(#fillEcoscore)"
              stroke="var(--color-ecoscore)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

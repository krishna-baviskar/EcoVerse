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
import { BarChart, Flower2, Leaf, Skull, Wind, Cloudy } from 'lucide-react';

const ratingData = [
    {
        range: '90 – 100',
        condition: 'Excellent',
        icon: Leaf,
        meaning: 'Environment is clean, balanced, and healthy.',
        causes: 'Low AQI, ideal temperature, comfortable humidity, high greenery, low emissions.',
        suggestions: 'Maintain habits, use public transport, support green projects.',
    },
    {
        range: '75 – 89',
        condition: 'Good',
        icon: Flower2,
        meaning: 'Healthy environment with mild pollution or heat imbalance.',
        causes: 'Moderate AQI, slightly high temperature, mild urban traffic.',
        suggestions: 'Participate in challenges, plant trees, reduce energy waste.',
    },
    {
        range: '60 – 74',
        condition: 'Moderate',
        icon: Cloudy,
        meaning: 'Air or temperature slightly outside ideal range.',
        causes: 'Noticeable pollution (AQI 100-200), urban heat, construction dust.',
        suggestions: 'Cycle, use reusable bags, support anti-pollution drives.',
    },
    {
        range: '40 – 59',
        condition: 'Poor',
        icon: Wind,
        meaning: 'Environment uncomfortable due to air or temperature imbalance.',
        causes: 'Poor air quality (AQI 200-300), heavy traffic, poor waste management.',
        suggestions: 'Carpool, wear masks outdoors, avoid peak pollution hours.',
    },
    {
        range: '0 – 39',
        condition: 'Severe',
        icon: Skull,
        meaning: 'Hazardous air or extreme temperature conditions.',
        causes: 'Toxic pollution (AQI > 300), extreme heat waves, industrial activity.',
        suggestions: 'Stay indoors, join awareness drives, push for stricter controls.',
    },
];

export function EcoScoreRatingScale() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BarChart /> EcoScore Rating Scale
        </CardTitle>
        <CardDescription>
          Understand what your EcoScore means and how you can improve it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Score</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratingData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-semibold">{item.range}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.condition}</span>
                  </div>
                </TableCell>
                <TableCell>
                    <p className="font-medium">{item.meaning}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-semibold">Suggestions: </span>{item.suggestions}
                    </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

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
import { BarChart } from 'lucide-react';

const ratingData = [
    {
        range: '90 – 100',
        condition: '🌿 Excellent',
        meaning: 'Air, temperature, and humidity are ideal.',
        suggestions: 'Maintain eco-friendly habits.',
    },
    {
        range: '75 – 89',
        condition: '🌼 Good',
        meaning: 'Environment is healthy with mild pollution or heat.',
        suggestions: 'Participate in green challenges.',
    },
    {
        range: '60 – 74',
        condition: '🌤️ Moderate',
        meaning: 'Some imbalance in air or temperature.',
        suggestions: 'Encourage small eco actions.',
    },
    {
        range: '40 – 59',
        condition: '🌫️ Poor',
        meaning: 'Air quality or heat affecting comfort.',
        suggestions: 'Reduce emissions, stay hydrated.',
    },
    {
        range: '0 – 39',
        condition: '☠️ Severe',
        meaning: 'High pollution or extreme climate.',
        suggestions: 'Urgent need for awareness actions.',
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
              <TableHead>EcoScore Range</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Meaning / Environment Quality</TableHead>
              <TableHead>User Suggestion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratingData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-semibold">{item.range}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{item.condition}</span>
                  </div>
                </TableCell>
                <TableCell>{item.meaning}</TableCell>
                <TableCell>{item.suggestions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

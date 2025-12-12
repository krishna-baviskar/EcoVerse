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
        meaning: 'Environment is clean, balanced, and healthy.',
        causes: '✅ Low AQI (below 50)\n✅ Ideal temperature (20–27°C)\n✅ Comfortable humidity (40–60%)\n✅ High greenery and low emissions',
        suggestions: '🌱 Maintain eco-friendly habits.\n🌞 Continue using public transport and renewable energy.\n💧 Support green infrastructure projects.',
    },
    {
        range: '75 – 89',
        condition: '🌼 Good',
        meaning: 'Healthy environment with mild pollution or heat imbalance.',
        causes: '⚙️ Moderate AQI (50–100)\n🌡️ Slightly high temperature\n🚗 Mild urban traffic or open burning',
        suggestions: '🚴 Participate in green challenges.\n🪴 Plant trees or rooftop gardens.\n🔋 Reduce energy waste at home.',
    },
    {
        range: '60 – 74',
        condition: '🌤️ Moderate',
        meaning: 'Air or temperature slightly outside ideal range.',
        causes: '🌫️ AQI between 100–200 (noticeable pollution)\n🔥 Urban heat island effect\n🏗️ Ongoing construction or dust',
        suggestions: '💧 Encourage small eco actions (cycling, reusable bags).\n🌬️ Support anti-pollution drives.',
    },
    {
        range: '40 – 59',
        condition: '🌫️ Poor',
        meaning: 'Environment uncomfortable due to air or temperature imbalance.',
        causes: '💨 AQI between 200–300 (poor air quality)\n🚙 Heavy traffic congestion\n♻️ Poor waste management\n🔥 Industrial/vehicular emissions',
        suggestions: '🧼 Reduce emissions (carpool, public transport).\n😷 Stay hydrated and wear masks outdoors.\n🪟 Avoid outdoor activities at peak pollution hours.',
    },
    {
        range: '0 – 39',
        condition: '☠️ Severe',
        meaning: 'Hazardous air or extreme temperature conditions.',
        causes: '☠️ AQI above 300 (toxic pollution)\n🌡️ Extreme heat or cold waves\n🔥 Uncontrolled industrial activity\n🚫 No waste segregation or greenery',
        suggestions: '🚨 Urgent action needed!\n🚷 Stay indoors, avoid outdoor exposure.\n🌳 Participate in awareness and clean-up drives.\n⚡ Push for stricter pollution control measures.',
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
              <TableHead>Possible Causes</TableHead>
              <TableHead>User Suggestions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratingData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-semibold whitespace-nowrap">{item.range}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>{item.condition}</span>
                  </div>
                </TableCell>
                <TableCell>{item.meaning}</TableCell>
                <TableCell className="whitespace-pre-line">{item.causes}</TableCell>
                <TableCell className="whitespace-pre-line">{item.suggestions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

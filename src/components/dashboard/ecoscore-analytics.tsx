
'use client';

import {
  Activity,
  Droplets,
  Target,
  Wind,
  Zap,
} from 'lucide-react';
import type { PredictEcoScoreOutput } from '@/ai/flows';

interface EcoScoreAnalyticsProps {
  ecoScoreData: PredictEcoScoreOutput | null;
}

export function EcoScoreAnalytics({ ecoScoreData }: EcoScoreAnalyticsProps) {
  const activityDistribution = [
    { label: 'Transport', value: '30%', color: 'emerald' },
    { label: 'Energy', value: '25%', color: 'blue' },
    { label: 'Waste', value: '25%', color: 'purple' },
    { label: 'Other', value: '20%', color: 'yellow' },
  ];

  const challengeStats = {
    completed: 38,
    inProgress: 7,
    total: 45,
  };
  
  const categoryPerformance = [
    {
      category: 'Air Quality',
      score: ecoScoreData?.breakdown.find(b => b.factor === "Air Quality")?.derivedScore || 0,
      icon: Wind,
      color: 'emerald'
    },
    {
      category: 'Temperature',
      score: ecoScoreData?.breakdown.find(b => b.factor === "Temperature")?.derivedScore || 0,
      icon: Activity,
      color: 'blue'
    },
    {
      category: 'Humidity',
      score: ecoScoreData?.breakdown.find(b => b.factor === "Humidity")?.derivedScore || 0,
      icon: Droplets,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
        <h3 className="text-2xl font-bold mb-6">EcoScore Analytics</h3>

        <div className="grid md:grid-cols-2 gap-8 mb-8 items-center">
          {/* Circular Progress */}
          <div className="relative flex justify-center">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-white/10"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    88 *
                    (1 - (ecoScoreData?.ecoScore || 0) / 100)
                  }`}
                  className="text-emerald-400"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-emerald-400">
                  {ecoScoreData?.ecoScore?.toFixed(0) || 'N/A'}
                </div>
                <div className="text-sm text-gray-400">EcoScore</div>
              </div>
            </div>
          </div>

          {/* Pie Chart - Activity Distribution */}
          <div>
            <h4 className="text-center font-semibold mb-4">
              Activity Distribution
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {activityDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-3 h-3 rounded-full bg-${item.color}-500`}
                  ></div>
                  <span className="text-gray-400">
                    {item.label}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-emerald-400">
              {challengeStats.completed}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-yellow-400">
              {challengeStats.inProgress}
            </div>
            <div className="text-xs text-gray-400">In Progress</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-blue-400">
              {challengeStats.total}
            </div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
      </div>
      
      {/* Category Performance */}
      <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
        <h3 className="text-2xl font-bold mb-6">Category Performance</h3>

        <div className="space-y-4">
          {categoryPerformance.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                  <span className="font-semibold text-sm">
                    {item.category}
                  </span>
                </div>
                <span className="font-bold text-white">
                  {item.score.toFixed(0)}/100
                </span>
              </div>

              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full transition-all duration-1000`}
                  style={{
                    width: `${item.score}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

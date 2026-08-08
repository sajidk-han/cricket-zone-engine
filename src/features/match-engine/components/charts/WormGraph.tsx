"use client"

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { WormDataPoint } from '../../utils/analytics'

interface WormGraphProps {
  data: WormDataPoint[];
  team1Name: string;
  team2Name: string;
}

export function WormGraph({ data, team1Name, team2Name }: WormGraphProps) {
  return (
    <div className="w-full flex flex-col h-[320px] bg-bg-surface p-4 rounded-xl border border-bg-elevated">
      <h3 className="text-sm font-bold text-text-secondary mb-4 shrink-0">Worm Graph (Cumulative Runs)</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="over" 
              stroke="#888" 
              tick={{ fill: '#888', fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#333' }}
            />
            <YAxis 
              stroke="#888" 
              tick={{ fill: '#888', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }}
              itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
              labelStyle={{ color: '#888', marginBottom: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line 
              type="monotone" 
              dataKey="team1Runs" 
              name={team1Name} 
              stroke="#10b981" // brand primary
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="team2Runs" 
              name={team2Name} 
              stroke="#3b82f6" // blue
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

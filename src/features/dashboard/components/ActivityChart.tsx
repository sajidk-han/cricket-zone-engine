"use client"

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'

const data = [
  { name: 'Mon', matches: 2, players: 14 },
  { name: 'Tue', matches: 4, players: 28 },
  { name: 'Wed', matches: 3, players: 21 },
  { name: 'Thu', matches: 7, players: 50 },
  { name: 'Fri', matches: 5, players: 35 },
  { name: 'Sat', matches: 12, players: 84 },
  { name: 'Sun', matches: 15, players: 105 },
]

export function ActivityChart() {
  return (
    <Card className="col-span-full xl:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Activity Overview (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#a1a1aa" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#a1a1aa" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                itemStyle={{ color: '#f4f4f5' }}
              />
              <Area
                type="monotone"
                dataKey="players"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorPlayers)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="matches"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#colorMatches)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

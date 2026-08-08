"use client"

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ManhattanDataPoint } from '../../utils/analytics'

interface ManhattanGraphProps {
  data: ManhattanDataPoint[];
  color?: string;
}

export function ManhattanGraph({ data, color = "#10b981" }: ManhattanGraphProps) {
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ManhattanDataPoint
      return (
        <div className="bg-[#1A1A1A] border border-[#333] p-3 rounded-lg shadow-lg">
          <p className="text-text-secondary mb-1">Over {label}</p>
          <p className="text-text-primary font-bold text-lg">{dataPoint.runs} Runs</p>
          {dataPoint.wickets > 0 && (
            <p className="text-red-500 font-bold mt-1">{dataPoint.wickets} Wicket{dataPoint.wickets > 1 ? 's' : ''}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full flex flex-col h-[320px] bg-bg-surface p-4 rounded-xl border border-bg-elevated">
      <h3 className="text-sm font-bold text-text-secondary mb-4 shrink-0">Manhattan Graph (Runs per Over)</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 0, left: -20, bottom: 5 }}
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff10' }} />
            <Bar dataKey="runs" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.wickets > 0 ? '#ef4444' : color} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

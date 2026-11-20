import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card3D } from '../../components/3d/Card3D';
import { revenueTrendsData } from '../../data/initialData';
import { formatCurrency } from '../../utils/formatters';

export const RevenueAnalyticsChart = () => {
  const [timePeriod, setTimePeriod] = useState('6M');

  // Custom sleek tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-[#080B14]/95 border border-white/10 shadow-2xl backdrop-blur-xl text-xs space-y-1">
          <p className="font-bold text-white mb-1.5">{label} 2026</p>
          <div className="flex items-center justify-between gap-4 text-[#7967FF]">
            <span>Revenue:</span>
            <span className="font-semibold">{formatCurrency(payload[0]?.value)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[#38BDF8]">
            <span>Pipeline:</span>
            <span className="font-semibold">{formatCurrency(payload[1]?.value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card3D className="p-6">
      {/* Header with time periods */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Revenue Performance & Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time closed ARR vs projected sales pipeline
          </p>
        </div>

        {/* Time period filter selector */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          {['7D', '30D', '6M', '1Y'].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                timePeriod === period
                  ? 'bg-gradient-to-r from-[#7967FF] to-[#38BDF8] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueTrendsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7967FF" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#7967FF" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="pipelineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7967FF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
            <Area
              type="monotone"
              dataKey="pipeline"
              stroke="#38BDF8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#pipelineGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card3D>
  );
};


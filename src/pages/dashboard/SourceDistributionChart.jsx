import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card3D } from '../../components/3d/Card3D';
import { sourceDistributionData } from '../../data/initialData';

export const SourceDistributionChart = () => {
  return (
    <Card3D className="p-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
          Revenue by Source
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Breakdown of deal origination channels
        </p>
      </div>

      <div className="w-full h-56 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(8, 11, 20, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`, 'Share']}
            />
            <Pie
              data={sourceDistributionData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {sourceDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-extrabold text-white">100%</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Origin</span>
        </div>
      </div>

      {/* Legend below */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
        {sourceDistributionData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-300 truncate">{item.name}</span>
            <span className="ml-auto font-semibold text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card3D>
  );
};


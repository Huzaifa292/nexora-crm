import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card3D } from '../../components/3d/Card3D';
import { leadAcquisitionData } from '../../data/initialData';

export const LeadsPipelineChart = () => {
  return (
    <Card3D className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Lead Acquisition Inflow
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Weekly inbound volume broken down by marketing channel
          </p>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={leadAcquisitionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="day"
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(8, 11, 20, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar dataKey="organic" name="Organic Search" fill="#7967FF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="referral" name="Partner Referral" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="paid" name="Paid Acquisition" fill="#22C55E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card3D>
  );
};


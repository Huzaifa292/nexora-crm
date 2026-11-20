import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  BarChart2,
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/common/Button';
import { Card3D } from '../../components/3d/Card3D';
import { revenueTrendsData } from '../../data/initialData';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';
import { useToastStore } from '../../store/toastStore';

export const ReportsPage = () => {
  const { deals, leads, contacts, getMetrics } = useCrmStore();
  const { addToast } = useToastStore();
  const metrics = getMetrics();

  const [dateRange, setDateRange] = useState('H2 2026');

  // Stage breakdown
  const stageBreakdown = [
    { stage: 'New', count: deals.filter((d) => d.stage === 'New').length, value: deals.filter((d) => d.stage === 'New').reduce((sum, d) => sum + (Number(d.value) || 0), 0) },
    { stage: 'Qualified', count: deals.filter((d) => d.stage === 'Qualified').length, value: deals.filter((d) => d.stage === 'Qualified').reduce((sum, d) => sum + (Number(d.value) || 0), 0) },
    { stage: 'Proposal', count: deals.filter((d) => d.stage === 'Proposal').length, value: deals.filter((d) => d.stage === 'Proposal').reduce((sum, d) => sum + (Number(d.value) || 0), 0) },
    { stage: 'Negotiation', count: deals.filter((d) => d.stage === 'Negotiation').length, value: deals.filter((d) => d.stage === 'Negotiation').reduce((sum, d) => sum + (Number(d.value) || 0), 0) },
    { stage: 'Won', count: deals.filter((d) => d.stage === 'Won').length, value: deals.filter((d) => d.stage === 'Won').reduce((sum, d) => sum + (Number(d.value) || 0), 0) },
  ];

  const handleExportReport = () => {
    const reportRows = revenueTrendsData.map((r) => ({
      Month: r.month,
      RevenueClosed: r.revenue,
      PipelineActive: r.pipeline,
      QuotaTarget: r.target,
    }));
    exportToCsv(reportRows, 'Nexora_Executive_Revenue_Report.csv');
    addToast({
      title: 'Report Downloaded',
      message: 'Executive analytics CSV exported successfully.',
      type: 'success',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <PageHeader
        title="Reports & Analytics Center"
        subtitle="Holistic performance diagnostics, revenue forecast models, and pipeline conversion trends."
        breadcrumbs={[{ label: 'Reports' }]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 mr-2 text-[#38BDF8]" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent focus:outline-none text-white font-medium cursor-pointer"
              >
                <option value="H2 2026">H2 2026 (Jul - Dec)</option>
                <option value="Q4 2026">Q4 2026 (Current)</option>
                <option value="FY 2026">Full Year 2026</option>
              </select>
            </div>
            <Button variant="primary" icon={Download} onClick={handleExportReport}>
              Export Analytics CSV
            </Button>
          </div>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card3D className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Gross Revenue (ARR)</span>
            <div className="p-2 rounded-xl bg-[#7967FF]/15 text-[#7967FF] border border-[#7967FF]/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3">
            {formatCurrency(metrics.totalRevenue)}
          </div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +28.4% ahead of annual pacing
          </p>
        </Card3D>

        <Card3D className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Sales Win Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3">
            {metrics.winRate}%
          </div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> Top quartile benchmark
          </p>
        </Card3D>

        <Card3D className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Avg Deal Size</span>
            <div className="p-2 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/20">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3">
            {formatCurrency(deals.length > 0 ? metrics.totalRevenue / (deals.filter((d) => d.stage === 'Won').length || 1) : 0)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Across enterprise accounts</p>
        </Card3D>

        <Card3D className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Pipeline Coverage</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3">
            3.4x Quota
          </div>
          <p className="text-xs text-slate-400 mt-1">Healthy revenue buffer</p>
        </Card3D>
      </div>

      {/* Main Composed Chart: Revenue vs Targets */}
      <Card3D className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Revenue Attainment vs. Quota Targets
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Monthly closed ARR performance against board targets
            </p>
          </div>
        </div>

        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={revenueTrendsData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(8, 11, 20, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val) => [formatCurrency(val), '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="revenue" name="Closed Revenue" fill="#7967FF" radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="target" name="Quota Target" stroke="#38BDF8" strokeWidth={3} dot={{ r: 5, fill: '#38BDF8' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card3D>

      {/* Pipeline Stage Valuation Table */}
      <Card3D className="p-6">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-wide mb-1">
          Pipeline Funnel Health Breakdown
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Distribution of active contract value across lifecycle stages
        </p>

        <div className="space-y-4">
          {stageBreakdown.map((item, idx) => {
            const percentOfTotal = totalPipelineValue > 0 ? Math.round((item.value / totalPipelineValue) * 100) : 0;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.stage}</span>
                    <span className="text-slate-500">({item.count} deals)</span>
                  </div>
                  <div className="font-bold text-slate-200">
                    {formatCurrency(item.value)}
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7967FF] to-[#38BDF8]"
                    style={{ width: `${percentOfTotal || 5}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card3D>
    </motion.div>
  );
};


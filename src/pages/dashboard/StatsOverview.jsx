import React from 'react';
import { DollarSign, Users, Target, Briefcase, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card3D } from '../../components/3d/Card3D';
import { StatsSparkline } from '../../components/common/StatsSparkline';
import { formatCurrency } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';

export const StatsOverview = () => {
  const { getMetrics } = useCrmStore();
  const metrics = getMetrics();

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      change: '+24.8%',
      trend: 'vs. last month ($243.6K)',
      icon: DollarSign,
      glowColor: 'rgba(121, 103, 255, 0.25)',
      sparkColor: '#7967FF',
      sparkData: [180, 210, 195, 240, 275, 290, 319],
      iconBg: 'bg-[#7967FF]/15 text-[#A78BFA] border-[#7967FF]/30',
    },
    {
      label: 'Total Contacts',
      value: metrics.totalContacts.toLocaleString(),
      change: '+18.2%',
      trend: 'vs. last month (1,120)',
      icon: Users,
      glowColor: 'rgba(56, 189, 248, 0.25)',
      sparkColor: '#38BDF8',
      sparkData: [45, 52, 60, 58, 68, 74, 82],
      iconBg: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30',
    },
    {
      label: 'Active Leads',
      value: metrics.activeLeads.toLocaleString(),
      change: '+12.5%',
      trend: 'vs. last month (48)',
      icon: Target,
      glowColor: 'rgba(34, 197, 94, 0.25)',
      sparkColor: '#22C55E',
      sparkData: [30, 34, 32, 41, 39, 48, 54],
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
    {
      label: 'Total Deals',
      value: metrics.totalDeals.toLocaleString(),
      change: '+15.3%',
      trend: `Pipeline: ${formatCurrency(metrics.pipelineValue)}`,
      icon: Briefcase,
      glowColor: 'rgba(245, 158, 11, 0.25)',
      sparkColor: '#F59E0B',
      sparkData: [12, 15, 14, 19, 22, 25, 28],
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card3D
            key={idx}
            glowColor={item.glowColor}
            className="p-5 overflow-hidden flex flex-col justify-between"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              <div className={`p-2.5 rounded-xl border ${item.iconBg} shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Value & trend */}
            <div className="my-3 flex items-baseline justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {item.value}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {item.change}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {item.trend}
                  </span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="hidden sm:block">
                <StatsSparkline data={item.sparkData} color={item.sparkColor} />
              </div>
            </div>
          </Card3D>
        );
      })}
    </div>
  );
};


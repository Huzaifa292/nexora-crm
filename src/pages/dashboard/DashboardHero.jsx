import React from 'react';
import { ArrowUpRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { ThreeHeroVisual } from '../../components/3d/ThreeHeroVisual';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';

export const DashboardHero = ({ onQuickDeal }) => {
  const { user, getMetrics } = useCrmStore();
  const metrics = getMetrics();

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#101626]/90 via-[#151E30]/90 to-[#080B14]/90 border border-white/[0.08] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(121,103,255,0.08)] backdrop-blur-2xl p-6 sm:p-8 overflow-hidden mb-8">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7967FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Information */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-[#38BDF8] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#7967FF]" />
            <span>AI Executive Forecast • Confidence 94.8%</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Good morning, <span className="gradient-text-purple-blue">{user.name}</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
            Here's what's happening with your business today. Pipeline velocity is trending{' '}
            <span className="text-emerald-400 font-semibold">+24.8%</span> ahead of target with{' '}
            <span className="text-[#38BDF8] font-semibold">{formatCurrency(metrics.pipelineValue)}</span> active pipeline.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 my-6 py-4 px-4 rounded-2xl bg-black/30 border border-white/5">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Win Rate
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {metrics.winRate}%
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Pipeline Value
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#38BDF8] mt-0.5">
                {formatCurrency(metrics.pipelineValue)}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Pending Tasks
              </div>
              <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-0.5">
                {metrics.pendingTasks}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="primary" icon={Zap} onClick={onQuickDeal}>
              Create New Deal
            </Button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC-2 Type II Certified Sync</span>
            </div>
          </div>
        </div>

        {/* Right 3D Visual Centerpiece */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <div className="w-full max-w-[340px] aspect-square relative rounded-3xl bg-radial from-white/[0.04] to-transparent p-4 flex items-center justify-center">
            {/* Embedded Interactive Three.js 3D Visual Mesh */}
            <ThreeHeroVisual className="w-full h-full" />
            <div className="absolute bottom-2 text-center text-[10px] text-slate-400 tracking-wider uppercase font-mono">
              NEXORA 3D SPATIAL CORE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


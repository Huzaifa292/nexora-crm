import React from 'react';
import {
  Building2,
  Calendar,
  User,
  MoreHorizontal,
  Edit2,
  Trash2,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const DealCard = ({
  deal,
  onEdit,
  onDelete,
  onDragStart,
  onMoveToStage,
}) => {
  const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const nextStage = stages[stages.indexOf(deal.stage) + 1];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      className="group relative p-4 rounded-2xl bg-[#151E30]/90 border border-white/10 hover:border-[#7967FF]/40 shadow-lg hover:shadow-[0_15px_30px_rgba(121,103,255,0.15)] transition-all cursor-grab active:cursor-grabbing backdrop-blur-xl"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
          {deal.title}
        </h4>
        <Badge status={deal.priority} size="xs">
          {deal.priority}
        </Badge>
      </div>

      {/* Company & Contact */}
      <div className="mt-2.5 space-y-1 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate">{deal.company}</span>
        </div>
        {deal.contact && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{deal.contact}</span>
          </div>
        )}
      </div>

      {/* Value & Probability Bar */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-base font-extrabold text-white">
            {formatCurrency(deal.value)}
          </span>
          <span className="text-[11px] font-semibold text-[#38BDF8]">
            {deal.probability}% Prob
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              deal.stage === 'Won'
                ? 'bg-emerald-400'
                : deal.stage === 'Lost'
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-[#7967FF] to-[#38BDF8]'
            }`}
            style={{ width: `${deal.probability}%` }}
          />
        </div>
      </div>

      {/* Footer Info & Quick Actions */}
      <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>{formatDate(deal.expectedClose)}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {deal.stage !== 'Won' && deal.stage !== 'Lost' && nextStage && (
            <button
              onClick={() => onMoveToStage(deal.id, nextStage)}
              className="p-1 rounded bg-white/5 hover:bg-[#7967FF]/20 text-slate-300 hover:text-white"
              title={`Advance to ${nextStage}`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onEdit(deal)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Edit Deal"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(deal)}
            className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
            title="Delete Deal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Award, UserCheck, RefreshCw, UserPlus, CheckCircle, Clock } from 'lucide-react';
import { Card3D } from '../../components/3d/Card3D';
import { formatRelativeTime } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';

export const RecentActivitiesWidget = () => {
  const { activities } = useCrmStore();

  const getIcon = (type) => {
    switch (type) {
      case 'deal_won':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'lead_converted':
        return <UserCheck className="w-4 h-4 text-[#38BDF8]" />;
      case 'stage_changed':
        return <RefreshCw className="w-4 h-4 text-[#7967FF]" />;
      case 'contact_added':
        return <UserPlus className="w-4 h-4 text-amber-400" />;
      case 'task_completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'deal_won':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'lead_converted':
        return 'bg-sky-500/10 border-sky-500/20';
      case 'stage_changed':
        return 'bg-[#7967FF]/10 border-[#7967FF]/20';
      case 'contact_added':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  return (
    <Card3D className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Recent Activities
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit log of deals, leads and team operations
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.slice(0, 5).map((act) => (
          <div key={act.id} className="flex items-start gap-3 group">
            <div
              className={`p-2 rounded-xl border ${getIconBg(
                act.type
              )} shrink-0 mt-0.5 shadow-sm group-hover:scale-105 transition-transform`}
            >
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors truncate">
                  {act.title}
                </h4>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {formatRelativeTime(act.timestamp)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{act.description}</p>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <span>By {act.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card3D>
  );
};


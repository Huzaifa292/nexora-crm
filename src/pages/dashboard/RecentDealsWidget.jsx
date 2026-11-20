import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Calendar } from 'lucide-react';
import { Card3D } from '../../components/3d/Card3D';
import { Badge } from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';

export const RecentDealsWidget = () => {
  const navigate = useNavigate();
  const { deals } = useCrmStore();

  const activeDeals = deals.slice(0, 5);

  return (
    <Card3D className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Pipeline Highlights
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Key opportunities in active negotiation
          </p>
        </div>
        <button
          onClick={() => navigate('/deals')}
          className="text-xs text-[#38BDF8] hover:text-white flex items-center gap-1 transition-colors group"
        >
          View Kanban
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {activeDeals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => navigate('/deals')}
            className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#7967FF]/30 transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white truncate">{deal.title}</h4>
                <Badge status={deal.stage} size="xs">
                  {deal.stage}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  {deal.company}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {formatDate(deal.expectedClose)}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-white">
                {formatCurrency(deal.value)}
              </div>
              <div className="text-[10px] text-slate-400">
                Prob: <span className="text-[#38BDF8]">{deal.probability}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card3D>
  );
};


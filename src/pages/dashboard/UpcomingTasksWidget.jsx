import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, Calendar, Flag } from 'lucide-react';
import { Card3D } from '../../components/3d/Card3D';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';

export const UpcomingTasksWidget = () => {
  const navigate = useNavigate();
  const { tasks, toggleTaskStatus } = useCrmStore();

  const sortedTasks = [...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  return (
    <Card3D className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Upcoming Action Items
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click checkbox to mark action completed
          </p>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="text-xs text-[#38BDF8] hover:text-white flex items-center gap-1 transition-colors group"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {sortedTasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
              task.completed
                ? 'bg-emerald-500/[0.03] border-emerald-500/10 opacity-60'
                : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-white/10'
            }`}
          >
            <button
              onClick={() => toggleTaskStatus(task.id)}
              className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h4
                className={`text-xs font-medium leading-snug ${
                  task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                }`}
              >
                {task.title}
              </h4>
              <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                <Badge status={task.priority} size="xs">
                  {task.priority}
                </Badge>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(task.dueDate)}
                </span>
                <span className="text-[11px] text-slate-500">
                  {task.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card3D>
  );
};


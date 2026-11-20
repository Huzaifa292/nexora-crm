import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Target,
  Kanban,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useCrmStore } from '../../store/crmStore';

export const Sidebar = () => {
  const location = useLocation();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    leads,
    deals,
    tasks,
    workspace,
  } = useCrmStore();

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Contacts', path: '/contacts', icon: Users },
    {
      label: 'Leads',
      path: '/leads',
      icon: Target,
      badge: leads.filter((l) => l.status === 'New' || l.status === 'Qualified').length,
    },
    {
      label: 'Deals',
      path: '/deals',
      icon: Kanban,
      badge: deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost').length,
    },
    {
      label: 'Tasks',
      path: '/tasks',
      icon: CheckSquare,
      badge: tasks.filter((t) => !t.completed).length,
    },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-white/[0.08] bg-[#0D1320]/95 backdrop-blur-2xl transition-all duration-300 z-30 select-none ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#7967FF] to-[#38BDF8] p-[1.5px] shadow-lg shadow-[#7967FF]/25">
            <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center">
              <img src="/logo.svg" alt="Nexora" className="w-5 h-5" />
            </div>
          </div>

          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">NEXORA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#7967FF]/20 text-[#A78BFA] border border-[#7967FF]/30">
                  CRM
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">Enterprise 3D SaaS</span>
            </motion.div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
        {!sidebarCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'text-white bg-gradient-to-r from-[#7967FF]/20 to-[#38BDF8]/10 border border-[#7967FF]/30 shadow-md shadow-[#7967FF]/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-6 bg-[#38BDF8] rounded-r-full shadow-[0_0_12px_#38BDF8]"
                />
              )}

              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#38BDF8]' : 'text-slate-400 group-hover:text-white'
                }`}
              />

              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/10">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Workspace Footer */}
      {!sidebarCollapsed ? (
        <div className="p-3 border-t border-white/[0.08] m-2 rounded-2xl bg-white/[0.02] border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7967FF]/20 to-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] border border-white/10">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{workspace.name}</div>
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {workspace.tier}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-white/[0.08] flex justify-center">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400" title={workspace.name}>
            <Building2 className="w-4 h-4" />
          </div>
        </div>
      )}
    </aside>
  );
};


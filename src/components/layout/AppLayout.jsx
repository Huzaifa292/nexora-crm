import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Target,
  Kanban,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ThreeAmbientBackground } from '../3d/ThreeAmbientBackground';
import { CommandPalette } from '../common/CommandPalette';
import { ToastContainer } from '../common/Toast';
import { useCrmStore } from '../../store/crmStore';

export const AppLayout = () => {
  const location = useLocation();
  const { mobileMenuOpen, setMobileMenuOpen } = useCrmStore();

  const mobileNavItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Contacts', path: '/contacts', icon: Users },
    { label: 'Leads', path: '/leads', icon: Target },
    { label: 'Deals', path: '/deals', icon: Kanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 flex flex-col relative selection:bg-[#7967FF]/30 selection:text-white">
      {/* 3D Ambient Background Canvas */}
      <ThreeAmbientBackground />

      {/* Decorative ambient gradient glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#7967FF]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/3 right-10 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Shell */}
      <div className="flex-1 flex w-full relative z-10">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar />

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-[#080B14]/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-72 max-w-[80vw] h-full bg-[#0D1320] border-r border-white/10 p-5 flex flex-col"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Nexora" className="w-6 h-6" />
                    <span className="font-extrabold text-lg text-white">NEXORA CRM</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-4 space-y-1 overflow-y-auto flex-1">
                  {mobileNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-[#7967FF]/20 text-[#38BDF8] border border-[#7967FF]/30'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />

          {/* Main Route Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Utilities */}
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};


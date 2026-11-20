import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Users,
  Target,
  Kanban,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCrmStore } from '../../store/crmStore';

export const CommandPalette = () => {
  const navigate = useNavigate();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    contacts,
    leads,
    deals,
    tasks,
  } = useCrmStore();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const navItems = [
    { label: 'Overview Dashboard', path: '/', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Contacts Directory', path: '/contacts', icon: Users, category: 'Navigation' },
    { label: 'Leads Pipeline', path: '/leads', icon: Target, category: 'Navigation' },
    { label: 'Deals Kanban Board', path: '/deals', icon: Kanban, category: 'Navigation' },
    { label: 'Tasks & Follow-ups', path: '/tasks', icon: CheckSquare, category: 'Navigation' },
    { label: 'Calendar & Meetings', path: '/calendar', icon: Calendar, category: 'Navigation' },
    { label: 'Reports & Analytics', path: '/reports', icon: BarChart3, category: 'Navigation' },
    { label: 'Workspace Settings', path: '/settings', icon: Settings, category: 'Navigation' },
  ];

  // Filter navigation
  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  // Filter search entities if query is at least 2 chars
  const matchingContacts = query.length >= 2
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.company.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingDeals = query.length >= 2
    ? deals.filter((d) =>
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.company.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const handleSelect = (action) => {
    setCommandPaletteOpen(false);
    setQuery('');
    action();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="fixed inset-0 bg-[#080B14]/85 backdrop-blur-md"
        />

        {/* Command Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl rounded-2xl bg-[#151E30] border border-[#7967FF]/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(121,103,255,0.2)] overflow-hidden z-10"
        >
          {/* Input Box */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <Search className="w-5 h-5 text-[#38BDF8] shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, page, contact, or deal..."
              className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base"
            />
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-white/10 rounded border border-white/10">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Quick Actions / Navigation */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center justify-between">
                <span>Pages & Modules</span>
                <span className="text-[10px] text-[#7967FF]">Jump to</span>
              </div>
              <div className="space-y-1">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(() => navigate(item.path))}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#7967FF]/15 text-slate-200 hover:text-white transition-colors group text-sm text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-[#7967FF]/30 text-slate-300 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#38BDF8] transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matching Contacts */}
            {matchingContacts.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
                  Matching Contacts
                </div>
                <div className="space-y-1">
                  {matchingContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleSelect(() => navigate('/contacts'))}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#7967FF]/15 text-slate-200 hover:text-white transition-colors text-sm text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={contact.avatar}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <span className="font-medium text-white">{contact.name}</span>
                          <span className="text-xs text-slate-400 ml-2">({contact.company})</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#38BDF8]">{contact.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Deals */}
            {matchingDeals.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
                  Matching Deals
                </div>
                <div className="space-y-1">
                  {matchingDeals.map((deal) => (
                    <button
                      key={deal.id}
                      onClick={() => handleSelect(() => navigate('/deals'))}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#7967FF]/15 text-slate-200 hover:text-white transition-colors text-sm text-left"
                    >
                      <div>
                        <span className="font-medium text-white">{deal.title}</span>
                        <span className="text-xs text-slate-400 ml-2">({deal.company})</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">
                        ${deal.value.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="px-4 py-2.5 bg-black/30 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7967FF]" />
              Quick Command Menu
            </span>
            <span>Use ↑ ↓ to navigate, ESC to dismiss</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


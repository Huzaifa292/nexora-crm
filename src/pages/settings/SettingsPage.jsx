import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building,
  Palette,
  Bell,
  RefreshCw,
  Info,
  CheckCircle,
  Sun,
  Moon,
  Shield,
  Save,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/common/Button';
import { Card3D } from '../../components/3d/Card3D';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useCrmStore } from '../../store/crmStore';
import { useToastStore } from '../../store/toastStore';

export const SettingsPage = () => {
  const {
    user,
    updateUser,
    workspace,
    updateWorkspace,
    theme,
    toggleTheme,
    resetDemoData,
  } = useCrmStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    timezone: user.timezone,
    currency: user.currency,
  });

  // Workspace Form state
  const [workspaceForm, setWorkspaceForm] = useState({
    name: workspace.name,
    tier: workspace.tier,
    totalSeats: workspace.totalSeats,
    region: workspace.region,
  });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    dealWonConfetti: true,
    weeklyDigest: true,
    browserPush: false,
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser(profileForm);
    addToast({
      title: 'Profile Updated',
      message: 'Your personal information has been saved.',
      type: 'success',
    });
  };

  const handleSaveWorkspace = (e) => {
    e.preventDefault();
    updateWorkspace(workspaceForm);
    addToast({
      title: 'Workspace Updated',
      message: 'Enterprise configuration saved.',
      type: 'success',
    });
  };

  const handleResetData = () => {
    resetDemoData();
    addToast({
      title: 'Demo Data Reset',
      message: 'Restored original demo contacts, deals, tasks, and analytics.',
      type: 'info',
    });
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Building },
    { id: 'appearance', label: 'Appearance & 3D', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System & Data', icon: RefreshCw },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Settings & Preferences"
        subtitle="Configure your executive account profile, visual themes, workspace parameters, and demo records."
        breadcrumbs={[{ label: 'Settings' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card3D className="p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#7967FF]/20 text-white border border-[#7967FF]/40 shadow-md shadow-[#7967FF]/10 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#38BDF8]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </Card3D>
        </div>

        {/* Tab Content Panes */}
        <div className="md:col-span-8 lg:col-span-9">
          {/* 1. Profile Tab */}
          {activeTab === 'profile' && (
            <Card3D className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-1">User Profile</h3>
              <p className="text-xs text-slate-400 mb-6">
                Manage your identity and regional business settings.
              </p>

              {/* Avatar Preview */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#7967FF]/40 shadow-lg"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{user.name}</h4>
                  <p className="text-xs text-[#38BDF8]">{user.role}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Enterprise Executive Session</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Executive Role
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.role}
                      onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Timezone
                    </label>
                    <input
                      type="text"
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <Button variant="primary" type="submit" icon={Save}>
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </Card3D>
          )}

          {/* 2. Workspace Tab */}
          {activeTab === 'workspace' && (
            <Card3D className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-1">Workspace Settings</h3>
              <p className="text-xs text-slate-400 mb-6">
                Organization details and infrastructure allocation.
              </p>

              <form onSubmit={handleSaveWorkspace} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      value={workspaceForm.name}
                      onChange={(e) => setWorkspaceForm({ ...workspaceForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Subscription Tier
                    </label>
                    <input
                      type="text"
                      value={workspaceForm.tier}
                      onChange={(e) => setWorkspaceForm({ ...workspaceForm, tier: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Licensed Seats
                    </label>
                    <input
                      type="number"
                      value={workspaceForm.totalSeats}
                      onChange={(e) => setWorkspaceForm({ ...workspaceForm, totalSeats: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Primary Cloud Region
                    </label>
                    <input
                      type="text"
                      value={workspaceForm.region}
                      onChange={(e) => setWorkspaceForm({ ...workspaceForm, region: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <Button variant="primary" type="submit" icon={Save}>
                    Update Workspace
                  </Button>
                </div>
              </form>
            </Card3D>
          )}

          {/* 3. Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card3D className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-1">Appearance & Visual Effects</h3>
              <p className="text-xs text-slate-400 mb-6">
                Switch themes and manage 3D perspective enhancements.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-3">
                    Theme Mode
                  </label>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button
                      type="button"
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        theme === 'dark'
                          ? 'bg-[#7967FF]/20 border-[#7967FF] shadow-lg shadow-[#7967FF]/20 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <Moon className="w-5 h-5 text-[#38BDF8]" />
                      <div>
                        <div className="text-sm font-bold">Dark Luxury</div>
                        <div className="text-[11px] opacity-75">#080B14 Dark Aesthetic</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => theme !== 'light' && toggleTheme()}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        theme === 'light'
                          ? 'bg-[#7967FF]/20 border-[#7967FF] shadow-lg shadow-[#7967FF]/20 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <Sun className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-sm font-bold">Light Minimalist</div>
                        <div className="text-[11px] opacity-75">Clean Slate Executive</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Active 3D Features Enabled:
                  </div>
                  <p>• Three.js Interactive Spatial Polyhedral Core (60 FPS WebGL)</p>
                  <p>• Ambient Dynamic Floating Starfield Background</p>
                  <p>• Mouse Tracking 3D Perspective Card Tilt (KaTeX & Matrix transforms)</p>
                  <p>• Layered Glassmorphic Backdrops with Blur-16px Depth</p>
                </div>
              </div>
            </Card3D>
          )}

          {/* 4. Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card3D className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-1">Notification Preferences</h3>
              <p className="text-xs text-slate-400 mb-6">
                Choose alerts and trigger conditions.
              </p>

              <div className="space-y-4">
                {[
                  { key: 'emailAlerts', title: 'High-Value Deal Alerts', desc: 'Notify when opportunities over $50,000 are created or won.' },
                  { key: 'dealWonConfetti', title: 'Confetti Celebrations', desc: 'Trigger celebratory animations on closed-won contracts.' },
                  { key: 'weeklyDigest', title: 'Weekly Executive ARR Digest', desc: 'Summary of team performance and pipeline velocity.' },
                  { key: 'browserPush', title: 'Browser Instant Notifications', desc: 'Real-time push alerts for urgent task deadlines.' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                      className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                        notifications[item.key] ? 'bg-[#7967FF]' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          notifications[item.key] ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card3D>
          )}

          {/* 5. System & Demo Data Reset Tab */}
          {activeTab === 'system' && (
            <Card3D className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-1">System & Demo Data Management</h3>
              <p className="text-xs text-slate-400 mb-6">
                Application architecture and persistent storage control.
              </p>

              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#38BDF8]" />
                    Application Specifications:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>Version: <span className="text-white font-mono">v2.4.0-Production</span></div>
                    <div>Environment: <span className="text-emerald-400 font-mono">Vercel Ready</span></div>
                    <div>State Driver: <span className="text-white font-mono">Zustand + LocalStorage</span></div>
                    <div>3D Engine: <span className="text-[#7967FF] font-mono">Three.js WebGL</span></div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/[0.03]">
                  <h4 className="text-sm font-bold text-rose-300 mb-1">Reset Initial Demo Records</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Restore the realistic demo contacts, leads, deals, tasks and calendar events if you want to reset after testing CRUD operations.
                  </p>
                  <Button
                    variant="danger"
                    icon={RefreshCw}
                    onClick={() => setResetConfirmOpen(true)}
                  >
                    Reset Demo Data
                  </Button>
                </div>
              </div>
            </Card3D>
          )}
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset Demo Records?"
        message="This will re-initialize all contacts, leads, deals and tasks with factory sample records. Any custom additions will be reverted."
        confirmText="Confirm Reset"
      />
    </motion.div>
  );
};


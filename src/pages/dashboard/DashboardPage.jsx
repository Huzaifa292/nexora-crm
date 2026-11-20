import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StatsOverview } from './StatsOverview';
import { DashboardHero } from './DashboardHero';
import { RevenueAnalyticsChart } from './RevenueAnalyticsChart';
import { LeadsPipelineChart } from './LeadsPipelineChart';
import { SourceDistributionChart } from './SourceDistributionChart';
import { RecentActivitiesWidget } from './RecentActivitiesWidget';
import { RecentDealsWidget } from './RecentDealsWidget';
import { UpcomingTasksWidget } from './UpcomingTasksWidget';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useCrmStore } from '../../store/crmStore';
import { useToastStore } from '../../store/toastStore';

export const DashboardPage = () => {
  const { addDeal, contacts } = useCrmStore();
  const { addToast } = useToastStore();
  const [quickDealModalOpen, setQuickDealModalOpen] = useState(false);

  const [dealForm, setDealForm] = useState({
    title: '',
    company: '',
    contact: '',
    value: '',
    stage: 'New',
    priority: 'Medium',
    expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!dealForm.title || !dealForm.company) {
      addToast({
        title: 'Validation Error',
        message: 'Please provide both a deal title and company name.',
        type: 'error',
      });
      return;
    }

    addDeal({
      ...dealForm,
      value: parseFloat(dealForm.value) || 25000,
    });

    addToast({
      title: 'Deal Created Successfully',
      message: `${dealForm.title} has entered your sales pipeline.`,
      type: 'success',
    });

    setQuickDealModalOpen(false);
    setDealForm({
      title: '',
      company: '',
      contact: '',
      value: '',
      stage: 'New',
      priority: 'Medium',
      expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* 3D Dashboard Hero with interactive spatial core */}
      <DashboardHero onQuickDeal={() => setQuickDealModalOpen(true)} />

      {/* 4 Interactive 3D Stat Cards */}
      <StatsOverview />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RevenueAnalyticsChart />
        </div>
        <div className="lg:col-span-4">
          <SourceDistributionChart />
        </div>
      </div>

      {/* Secondary Charts & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <LeadsPipelineChart />
        </div>
        <div className="lg:col-span-6">
          <RecentDealsWidget />
        </div>
      </div>

      {/* Activity Stream & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <RecentActivitiesWidget />
        </div>
        <div className="lg:col-span-6">
          <UpcomingTasksWidget />
        </div>
      </div>

      {/* Quick Deal Modal */}
      <Modal
        isOpen={quickDealModalOpen}
        onClose={() => setQuickDealModalOpen(false)}
        title="Create New Sales Opportunity"
        subtitle="Add a prospective contract to your active revenue pipeline."
      >
        <form onSubmit={handleCreateDeal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deal Title *
            </label>
            <input
              type="text"
              required
              value={dealForm.title}
              onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
              placeholder="e.g. Enterprise Cloud Spatial Analytics"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7967FF] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={dealForm.company}
                onChange={(e) => setDealForm({ ...dealForm, company: e.target.value })}
                placeholder="e.g. Acme Global Tech"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7967FF] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contract Value ($ USD) *
              </label>
              <input
                type="number"
                required
                value={dealForm.value}
                onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                placeholder="75000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7967FF] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Contact
              </label>
              <input
                type="text"
                value={dealForm.contact}
                onChange={(e) => setDealForm({ ...dealForm, contact: e.target.value })}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7967FF] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Initial Pipeline Stage
              </label>
              <select
                value={dealForm.stage}
                onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#101626] border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
              >
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Priority Level
              </label>
              <select
                value={dealForm.priority}
                onChange={(e) => setDealForm({ ...dealForm, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#101626] border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Expected Close Date
              </label>
              <input
                type="date"
                value={dealForm.expectedClose}
                onChange={(e) => setDealForm({ ...dealForm, expectedClose: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setQuickDealModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Opportunity
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};


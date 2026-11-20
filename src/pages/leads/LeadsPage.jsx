import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
  Flame,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card3D } from '../../components/3d/Card3D';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LeadModal } from './LeadModal';
import { LeadConvertModal } from './LeadConvertModal';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';
import { useToastStore } from '../../store/toastStore';

export const LeadsPage = () => {
  const { leads, addLead, updateLead, deleteLead, convertLeadToDealAndContact } = useCrmStore();
  const { addToast } = useToastStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('score');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Derived metrics
  const totalLeads = leads.length;
  const activeLeadsCount = leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length;
  const avgScore = totalLeads > 0 ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / totalLeads) : 0;
  const totalPotential = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

  // Filtering & Sorting
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch =
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' ? true : lead.status === statusFilter;
        const matchesSource = sourceFilter === 'All' ? true : lead.source === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
        if (sortBy === 'value') return (b.estimatedValue || 0) - (a.estimatedValue || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [leads, searchQuery, statusFilter, sourceFilter, sortBy]);

  const handleSaveLead = (formData) => {
    if (editingLead) {
      updateLead(editingLead.id, formData);
      addToast({
        title: 'Lead Updated',
        message: `${formData.name} was successfully updated.`,
        type: 'success',
      });
    } else {
      addLead(formData);
      addToast({
        title: 'Lead Created',
        message: `${formData.name} was added to prospects.`,
        type: 'success',
      });
    }
    setEditingLead(null);
  };

  const handleConvertLead = (leadId, dealTitle, dealValue) => {
    convertLeadToDealAndContact(leadId, dealTitle, dealValue);
    addToast({
      title: 'Lead Converted! 🎉',
      message: 'Created new Contact and active Pipeline Deal.',
      type: 'success',
    });
  };

  const handleDelete = () => {
    if (leadToDelete) {
      deleteLead(leadToDelete.id);
      addToast({
        title: 'Lead Removed',
        message: `${leadToDelete.name} was deleted.`,
        type: 'info',
      });
      setLeadToDelete(null);
    }
  };

  const handleExport = () => {
    const exportData = filteredLeads.map((l) => ({
      ID: l.id,
      Name: l.name,
      Company: l.company,
      Email: l.email,
      Score: l.score,
      Source: l.source,
      Status: l.status,
      EstimatedValue: l.estimatedValue,
      Owner: l.owner,
      CreatedAt: l.createdAt,
    }));
    exportToCsv(exportData, 'Nexora_Leads_Report.csv');
    addToast({
      title: 'Export Complete',
      message: `${exportData.length} leads exported.`,
      type: 'success',
    });
  };

  // Score styling helper
  const getScoreBadge = (score) => {
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Flame className="w-3 h-3" />
          {score} Hot
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          {score} Warm
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
        {score} Cold
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Lead Management"
        subtitle="Qualify marketing prospects, monitor AI lead scores, and convert high-intent inbound opportunities."
        breadcrumbs={[{ label: 'Leads' }]}
        actions={
          <>
            <Button variant="secondary" icon={Download} onClick={handleExport}>
              Export CSV
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setEditingLead(null);
                setModalOpen(true);
              }}
            >
              Add Lead
            </Button>
          </>
        }
      />

      {/* KPI Insight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#151E30]/75 border border-white/10 backdrop-blur-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Leads</div>
          <div className="text-2xl font-bold text-white mt-1">{totalLeads}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#151E30]/75 border border-white/10 backdrop-blur-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Active In Pipeline</div>
          <div className="text-2xl font-bold text-[#38BDF8] mt-1">{activeLeadsCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#151E30]/75 border border-white/10 backdrop-blur-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Average Lead Score</div>
          <div className="text-2xl font-bold text-[#7967FF] mt-1">{avgScore}/100</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#151E30]/75 border border-white/10 backdrop-blur-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Pipeline Potential</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalPotential)}</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#151E30]/80 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, company..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-[#7967FF] text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#7967FF]"
            >
              <option value="All">All Stages</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#7967FF]"
            >
              <option value="All">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Organic Search">Organic Search</option>
              <option value="Cold Outreach">Cold Outreach</option>
              <option value="Partner">Partner</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#7967FF]"
            >
              <option value="score">Sort by Score (Highest)</option>
              <option value="value">Sort by Value (Highest)</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          title="No leads match criteria"
          description="Adjust your search filters or create an inbound prospect lead."
          actionLabel="Add Lead"
          onAction={() => {
            setEditingLead(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="rounded-2xl bg-[#151E30]/75 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-slate-400 text-xs uppercase font-semibold border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Lead Profile</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Estimated Value</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                          {lead.name}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{lead.company}</span>
                          <span className="text-slate-600">•</span>
                          <span>{lead.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getScoreBadge(lead.score)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={lead.status}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {formatCurrency(lead.estimatedValue)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      {lead.owner}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {lead.status !== 'Converted' && (
                          <button
                            onClick={() => {
                              setLeadToConvert(lead);
                              setConvertModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#7967FF]/15 text-[#A78BFA] hover:bg-[#7967FF]/25 border border-[#7967FF]/30 transition-all"
                            title="Convert to Deal"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Convert
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingLead(lead);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setLeadToDelete(lead);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLead}
        lead={editingLead}
      />

      {/* Convert Lead Modal */}
      <LeadConvertModal
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        lead={leadToConvert}
        onConvert={handleConvertLead}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Remove lead ${leadToDelete?.name} (${leadToDelete?.company}) from the system?`}
      />
    </motion.div>
  );
};


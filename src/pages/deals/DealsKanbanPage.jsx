import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Plus,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/common/Button';
import { DealCard } from './DealCard';
import { DealModal } from './DealModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';
import { useToastStore } from '../../store/toastStore';

export const DealsKanbanPage = () => {
  const { deals, addDeal, updateDeal, deleteDeal, moveDealStage } = useCrmStore();
  const { addToast } = useToastStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [draggedOverStage, setDraggedOverStage] = useState(null);

  // Kanban Columns Definition
  const columns = [
    { id: 'New', label: 'New Lead', color: 'border-blue-500/30' },
    { id: 'Qualified', label: 'Qualified', color: 'border-purple-500/30' },
    { id: 'Proposal', label: 'Proposal Sent', color: 'border-indigo-500/30' },
    { id: 'Negotiation', label: 'Negotiation', color: 'border-amber-500/30' },
    { id: 'Won', label: 'Closed Won', color: 'border-emerald-500/30' },
    { id: 'Lost', label: 'Closed Lost', color: 'border-rose-500/30' },
  ];

  // Pipeline calculations
  const totalPipelineValue = useMemo(() => {
    return deals
      .filter((d) => d.stage !== 'Lost')
      .reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  }, [deals]);

  const wonRevenue = useMemo(() => {
    return deals
      .filter((d) => d.stage === 'Won')
      .reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  }, [deals]);

  // Drag and Drop handlers
  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    if (draggedOverStage !== stageId) {
      setDraggedOverStage(stageId);
    }
  };

  const handleDragLeave = (e) => {
    setDraggedOverStage(null);
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setDraggedOverStage(null);
    const dealId = e.dataTransfer.getData('text/plain');
    if (!dealId) return;

    const deal = deals.find((d) => d.id === dealId);
    if (deal && deal.stage !== targetStage) {
      moveDealStage(dealId, targetStage);

      // Trigger Confetti if moved to "Won"
      if (targetStage === 'Won') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7967FF', '#38BDF8', '#22C55E', '#F59E0B'],
        });
        addToast({
          title: 'Deal Won! 🚀',
          message: `Congratulations! ${deal.title} (${formatCurrency(deal.value)}) marked as Won.`,
          type: 'success',
        });
      } else {
        addToast({
          title: 'Stage Updated',
          message: `${deal.title} moved to ${targetStage}.`,
          type: 'info',
        });
      }
    }
  };

  const handleSaveDeal = (formData) => {
    if (editingDeal) {
      updateDeal(editingDeal.id, formData);
      addToast({
        title: 'Deal Updated',
        message: `${formData.title} was updated.`,
        type: 'success',
      });
    } else {
      addDeal(formData);
      addToast({
        title: 'Deal Created',
        message: `${formData.title} entered the pipeline.`,
        type: 'success',
      });
    }
    setEditingDeal(null);
  };

  const handleDelete = () => {
    if (dealToDelete) {
      deleteDeal(dealToDelete.id);
      addToast({
        title: 'Deal Removed',
        message: `${dealToDelete.title} was deleted.`,
        type: 'info',
      });
      setDealToDelete(null);
    }
  };

  const handleExport = () => {
    const exportData = deals.map((d) => ({
      ID: d.id,
      Title: d.title,
      Company: d.company,
      Contact: d.contact,
      Value: d.value,
      Stage: d.stage,
      Probability: `${d.probability}%`,
      ExpectedClose: d.expectedClose,
      Owner: d.owner,
      Priority: d.priority,
    }));
    exportToCsv(exportData, 'Nexora_Sales_Pipeline.csv');
    addToast({
      title: 'Export Complete',
      message: `${exportData.length} opportunities exported to CSV.`,
      type: 'success',
    });
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
        title="Sales Pipeline"
        subtitle="Manage end-to-end sales lifecycle, negotiate contracts, and drag opportunities across milestones."
        breadcrumbs={[{ label: 'Deals' }]}
        actions={
          <>
            <Button variant="secondary" icon={Download} onClick={handleExport}>
              Export CSV
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setEditingDeal(null);
                setModalOpen(true);
              }}
            >
              Add Opportunity
            </Button>
          </>
        }
      />

      {/* Pipeline Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#151E30]/80 border border-white/10 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">
              Total Active Pipeline
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {formatCurrency(totalPipelineValue)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#7967FF]/15 text-[#7967FF] border border-[#7967FF]/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151E30]/80 border border-white/10 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">
              Won Revenue (ARR)
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {formatCurrency(wonRevenue)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151E30]/80 border border-white/10 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">
              Total Deal Count
            </div>
            <div className="text-2xl font-extrabold text-[#38BDF8] mt-1">
              {deals.length} Opportunities
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Kanban Board Container with horizontal scrolling */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-5 min-w-[1240px]">
          {columns.map((col) => {
            const colDeals = deals.filter((d) => d.stage === col.id);
            const colTotalValue = colDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
            const isHovered = draggedOverStage === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex-1 min-w-[280px] max-w-[340px] rounded-2xl bg-[#0D1320]/80 border ${
                  isHovered
                    ? 'border-[#7967FF] bg-[#7967FF]/10 shadow-[0_0_25px_rgba(121,103,255,0.25)]'
                    : 'border-white/[0.08]'
                } p-4 flex flex-col transition-all duration-200 backdrop-blur-xl`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      {col.label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold">
                      {colDeals.length}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-300">
                    {formatCurrency(colTotalValue)}
                  </div>
                </div>

                {/* Column Cards List */}
                <div className="space-y-3.5 flex-1 min-h-[420px]">
                  {colDeals.length === 0 ? (
                    <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-xs text-slate-500">
                      Drag deal here
                    </div>
                  ) : (
                    colDeals.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onEdit={(d) => {
                          setEditingDeal(d);
                          setModalOpen(true);
                        }}
                        onDelete={(d) => {
                          setDealToDelete(d);
                          setDeleteConfirmOpen(true);
                        }}
                        onDragStart={handleDragStart}
                        onMoveToStage={(id, stage) => {
                          moveDealStage(id, stage);
                          if (stage === 'Won') {
                            confetti({ particleCount: 90, spread: 60 });
                          }
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Deal Modal */}
      <DealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveDeal}
        deal={editingDeal}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Sales Opportunity"
        message={`Are you sure you want to delete ${dealToDelete?.title}? This will adjust all active pipeline values.`}
      />
    </motion.div>
  );
};


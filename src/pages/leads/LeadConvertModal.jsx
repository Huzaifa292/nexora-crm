import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const LeadConvertModal = ({ isOpen, onClose, lead, onConvert }) => {
  if (!lead) return null;

  const [dealTitle, setDealTitle] = useState(`${lead.company} Expansion`);
  const [dealValue, setDealValue] = useState(lead.estimatedValue || 60000);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConvert(lead.id, dealTitle, dealValue);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Convert Lead to Opportunity"
      subtitle="Promote this qualified prospect directly to your Sales Pipeline and Contacts directory."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#7967FF]/10 border border-[#7967FF]/20 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0" />
          <div className="text-xs text-slate-200">
            Converting <strong className="text-white">{lead.name}</strong> from{' '}
            <strong className="text-white">{lead.company}</strong> (Score: {lead.score}).
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Opportunity / Deal Title *
          </label>
          <input
            type="text"
            required
            value={dealTitle}
            onChange={(e) => setDealTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Deal Target Value ($ USD) *
          </label>
          <input
            type="number"
            required
            value={dealValue}
            onChange={(e) => setDealValue(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-200">Automatic actions triggered:</p>
          <p>• Lead status changed to <span className="text-emerald-400 font-medium">Converted</span></p>
          <p>• New Customer record created for {lead.name} with email and phone</p>
          <p>• New opportunity added to Kanban Pipeline at "Qualified" stage</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={ArrowRight}>
            Confirm Conversion
          </Button>
        </div>
      </form>
    </Modal>
  );
};


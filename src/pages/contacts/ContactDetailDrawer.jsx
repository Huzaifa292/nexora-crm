import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Tag,
  FileText,
  Clock,
  Send,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';

export const ContactDetailDrawer = ({
  contact,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!contact) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#080B14]/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-screen max-w-md bg-[#101626] border-l border-white/10 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contact Profile
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onEdit(contact);
                      onClose();
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onDelete(contact);
                      onClose();
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Profile Avatar & Title */}
                <div className="flex items-center gap-4">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#7967FF]/40 shadow-lg"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                    <p className="text-xs text-[#38BDF8] font-medium">{contact.role}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge status={contact.status} size="xs">
                        {contact.status}
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium">
                        {contact.company}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Contact Channels
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <Mail className="w-4 h-4 text-[#7967FF] shrink-0" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-white hover:underline truncate"
                    >
                      {contact.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <Phone className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    <span>{contact.phone || 'No phone recorded'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{contact.location || 'Remote / Worldwide'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Last touch: {formatDate(contact.lastContacted)}</span>
                  </div>
                </div>

                {/* Tags */}
                {contact.tags && contact.tags.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#7967FF]" />
                      Classification Tags
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#7967FF]/10 text-[#A78BFA] border border-[#7967FF]/20 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
                    Internal Account Notes
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed">
                    {contact.notes || 'No notes added for this contact yet.'}
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <div className="p-6 border-t border-white/10 bg-white/[0.02]">
                <a
                  href={`mailto:${contact.email}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7967FF] to-[#38BDF8] text-white text-sm font-semibold shadow-lg shadow-[#7967FF]/20 hover:brightness-110 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Send Direct Email
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};


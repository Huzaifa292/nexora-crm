import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Video,
  Edit2,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card3D } from '../../components/3d/Card3D';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EventModal } from './EventModal';
import { formatDate } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';
import { useToastStore } from '../../store/toastStore';

export const CalendarPage = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useCrmStore();
  const { addToast } = useToastStore();

  const [currentDate, setCurrentDate] = useState(new Date('2026-11-20'));
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Month navigation
  const prevPeriod = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextPeriod = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate calendar grid days for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  // Pad previous month days
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ dayNumber: null, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayEvents = events.filter((e) => e.date === dateStr);
    days.push({
      dayNumber: i,
      dateStr,
      isCurrentMonth: true,
      events: dayEvents,
      isToday: dateStr === '2026-11-20',
    });
  }

  const handleSaveEvent = (formData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
      addToast({
        title: 'Event Updated',
        message: `${formData.title} has been updated.`,
        type: 'success',
      });
    } else {
      addEvent(formData);
      addToast({
        title: 'Event Scheduled',
        message: `${formData.title} added to calendar.`,
        type: 'success',
      });
    }
    setEditingEvent(null);
  };

  const handleDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      addToast({
        title: 'Event Removed',
        message: 'Event was deleted from schedule.',
        type: 'info',
      });
      setEventToDelete(null);
    }
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
        title="Executive Calendar"
        subtitle="Coordinate investor syncs, sales presentations, contract negotiations and product demos."
        breadcrumbs={[{ label: 'Calendar' }]}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingEvent(null);
              setModalOpen(true);
            }}
          >
            Schedule Event
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Calendar Grid */}
        <div className="lg:col-span-8">
          <Card3D className="p-6">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white tracking-wide">{monthName}</h3>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={prevPeriod}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextPeriod}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                    viewMode === 'month' ? 'bg-[#7967FF] text-white' : 'text-slate-400'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                    viewMode === 'week' ? 'bg-[#7967FF] text-white' : 'text-slate-400'
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            {viewMode === 'month' ? (
              <div>
                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400 uppercase">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((item, idx) => (
                    <div
                      key={idx}
                      className={`min-h-[90px] p-2 rounded-xl border transition-all flex flex-col justify-between ${
                        !item.isCurrentMonth
                          ? 'bg-transparent border-transparent opacity-20'
                          : item.isToday
                          ? 'bg-[#7967FF]/15 border-[#7967FF]/50 shadow-md shadow-[#7967FF]/10'
                          : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            item.isToday
                              ? 'text-[#38BDF8] font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.dayNumber}
                        </span>
                        {item.isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                        )}
                      </div>

                      {/* Day events pills */}
                      <div className="space-y-1 mt-1">
                        {item.events?.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => {
                              setEditingEvent(ev);
                              setModalOpen(true);
                            }}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#7967FF]/25 hover:bg-[#7967FF]/40 text-slate-200 truncate cursor-pointer transition-colors border border-[#7967FF]/30"
                            title={`${ev.title} (${ev.time})`}
                          >
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* List / Agenda View */
              <div className="space-y-3">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">{ev.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{formatDate(ev.date)}</span>
                        <span>•</span>
                        <span>{ev.time}</span>
                        <span>•</span>
                        <span>{ev.location}</span>
                      </div>
                    </div>
                    <Badge status={ev.type} size="xs">
                      {ev.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card3D>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="lg:col-span-4">
          <Card3D className="p-6">
            <h3 className="text-base font-bold text-white tracking-wide mb-1">
              Upcoming Schedule
            </h3>
            <p className="text-xs text-slate-400 mb-5">Confirmed client meetings</p>

            <div className="space-y-4">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                      {ev.title}
                    </h4>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingEvent(ev);
                          setModalOpen(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEventToDelete(ev);
                          setDeleteConfirmOpen(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#7967FF]" />
                      <span>{formatDate(ev.date)} • {ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{ev.location}</span>
                    </div>
                    {ev.attendees && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="truncate">{ev.attendees.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Cancel Event"
        message={`Remove "${eventToDelete?.title}" from schedule?`}
      />
    </motion.div>
  );
};


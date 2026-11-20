import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const EventModal = ({ isOpen, onClose, onSave, event = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '10:00 AM - 11:00 AM',
    type: 'Meeting',
    location: 'Google Meet',
    attendees: 'Huzaifa',
    notes: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        date: event.date || '',
        time: event.time || '10:00 AM - 11:00 AM',
        type: event.type || 'Meeting',
        location: event.location || 'Google Meet',
        attendees: Array.isArray(event.attendees) ? event.attendees.join(', ') : event.attendees || 'Huzaifa',
        notes: event.notes || '',
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        date: today,
        time: '10:00 AM - 11:00 AM',
        type: 'Meeting',
        location: 'Google Meet',
        attendees: 'Huzaifa, Client Lead',
        notes: '',
      });
    }
  }, [event, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const attendeesArray = formData.attendees
      ? formData.attendees.split(',').map((a) => a.trim()).filter(Boolean)
      : ['Huzaifa'];

    onSave({
      ...formData,
      attendees: attendeesArray,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Meeting Event' : 'Schedule Meeting / Call'}
      subtitle="Coordinate executive syncs, client demonstrations and reviews."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Event Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. HyperScale AI Executive Sync"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7967FF] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Time Range
            </label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="10:00 AM - 11:00 AM"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7967FF] text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Event Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#101626] border border-white/10 text-white focus:outline-none focus:border-[#7967FF] text-sm"
            >
              <option value="Meeting">Executive Meeting</option>
              <option value="Demo">Product Demo</option>
              <option value="Legal">Legal & Contract Review</option>
              <option value="Internal">Internal Standup</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Location / Platform
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Google Meet / Zoom"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7967FF] text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Attendees (comma separated)
          </label>
          <input
            type="text"
            value={formData.attendees}
            onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
            placeholder="Alexandra Vance, Huzaifa"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7967FF] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Meeting Agenda / Objective
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Agenda items, talking points, deliverables..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7967FF] text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {event ? 'Update Event' : 'Schedule Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};


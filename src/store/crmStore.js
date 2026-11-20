import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  initialUser,
  initialWorkspace,
  initialContacts,
  initialLeads,
  initialDeals,
  initialTasks,
  initialEvents,
  initialActivities,
} from '../data/initialData';

export const useCrmStore = create(
  persist(
    (set, get) => ({
      // User & Workspace
      user: initialUser,
      workspace: initialWorkspace,
      theme: 'dark', // 'dark' | 'light'

      // Entities
      contacts: initialContacts,
      leads: initialLeads,
      deals: initialDeals,
      tasks: initialTasks,
      events: initialEvents,
      activities: initialActivities,

      // Notifications
      notifications: [
        {
          id: 'notif-1',
          title: 'High-Value Deal Won! 🎉',
          message: 'Alexandra Vance (HyperScale AI) finalized $125,000 contract.',
          time: '35m ago',
          read: false,
          type: 'success',
        },
        {
          id: 'notif-2',
          title: 'Upcoming Legal Call',
          message: 'Vanguard Dynamics Legal Review scheduled tomorrow at 2:30 PM.',
          time: '2h ago',
          read: false,
          type: 'info',
        },
        {
          id: 'notif-3',
          title: 'New Inbound Lead Score 94',
          message: 'Nathaniel Drake requested an enterprise demo.',
          time: '5h ago',
          read: true,
          type: 'warning',
        },
      ],

      // UI States
      commandPaletteOpen: false,
      sidebarCollapsed: false,
      mobileMenuOpen: false,

      // Actions - UI
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        set({ theme: nextTheme });
      },

      // Actions - Notifications
      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      clearNotifications: () => set({ notifications: [] }),

      // Actions - User & Workspace
      updateUser: (updates) => {
        set((state) => ({ user: { ...state.user, ...updates } }));
      },
      updateWorkspace: (updates) => {
        set((state) => ({ workspace: { ...state.workspace, ...updates } }));
      },

      // Actions - Activity Logger helper
      logActivity: (type, title, description) => {
        const newAct = {
          id: `act-${Date.now()}`,
          type,
          title,
          description,
          user: get().user.name || 'Huzaifa',
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          activities: [newAct, ...state.activities.slice(0, 40)], // Keep last 40
        }));
      },

      // Actions - Contacts
      addContact: (contactData) => {
        const id = `ct-${Date.now()}`;
        const newContact = {
          id,
          avatar: contactData.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50000)}?auto=format&fit=crop&q=80&w=250`,
          lastContacted: new Date().toISOString().split('T')[0],
          ...contactData,
        };
        set((state) => ({
          contacts: [newContact, ...state.contacts],
        }));
        get().logActivity('contact_added', `New Contact Added: ${newContact.name}`, `Added ${newContact.name} from ${newContact.company}`);
        return newContact;
      },
      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
        get().logActivity('contact_updated', `Contact Updated`, `Updated details for contact`);
      },
      deleteContact: (id) => {
        const contact = get().contacts.find((c) => c.id === id);
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        }));
        if (contact) {
          get().logActivity('contact_deleted', `Contact Deleted: ${contact.name}`, `Removed contact from database`);
        }
      },

      // Actions - Leads
      addLead: (leadData) => {
        const id = `ld-${Date.now()}`;
        const newLead = {
          id,
          score: leadData.score || 70,
          createdAt: new Date().toISOString().split('T')[0],
          owner: leadData.owner || get().user.name,
          ...leadData,
        };
        set((state) => ({
          leads: [newLead, ...state.leads],
        }));
        get().logActivity('lead_added', `New Lead Created: ${newLead.name}`, `${newLead.company} entered the pipeline via ${newLead.source}`);
        return newLead;
      },
      updateLead: (id, updates) => {
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        }));
      },
      deleteLead: (id) => {
        const lead = get().leads.find((l) => l.id === id);
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        }));
        if (lead) {
          get().logActivity('lead_deleted', `Lead Removed: ${lead.name}`, `Removed lead from system`);
        }
      },
      convertLeadToDealAndContact: (leadId, dealTitle, dealValue) => {
        const lead = get().leads.find((l) => l.id === leadId);
        if (!lead) return;

        // 1. Mark lead as Converted
        get().updateLead(leadId, { status: 'Converted' });

        // 2. Create contact if doesn't exist
        const newContact = get().addContact({
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          status: 'Customer',
          role: 'Decision Maker',
          location: 'HQ',
          notes: `Converted from lead (${lead.source}). ${lead.notes || ''}`,
          tags: lead.tags || ['Converted Lead'],
        });

        // 3. Create active deal
        const newDeal = get().addDeal({
          title: dealTitle || `${lead.company} Contract`,
          company: lead.company,
          contact: lead.name,
          value: Number(dealValue) || lead.estimatedValue || 50000,
          stage: 'Qualified',
          owner: lead.owner || get().user.name,
          expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          probability: 60,
          priority: 'High',
          notes: `Deal originating from converted lead score ${lead.score}.`,
        });

        get().logActivity(
          'lead_converted',
          `Lead Converted: ${lead.name}`,
          `Converted into Contact and Deal "${newDeal.title}" ($${newDeal.value.toLocaleString()})`
        );
      },

      // Actions - Deals
      addDeal: (dealData) => {
        const id = `deal-${Date.now()}`;
        const newDeal = {
          id,
          stage: dealData.stage || 'New',
          owner: dealData.owner || get().user.name,
          probability: dealData.stage === 'Won' ? 100 : (dealData.stage === 'Lost' ? 0 : (dealData.probability || 40)),
          priority: dealData.priority || 'Medium',
          ...dealData,
        };
        set((state) => ({
          deals: [newDeal, ...state.deals],
        }));
        get().logActivity('deal_created', `Deal Created: ${newDeal.title}`, `Value: $${Number(newDeal.value).toLocaleString()}`);
        return newDeal;
      },
      updateDeal: (id, updates) => {
        set((state) => ({
          deals: state.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }));
      },
      moveDealStage: (id, newStage) => {
        const deal = get().deals.find((d) => d.id === id);
        if (!deal || deal.stage === newStage) return;

        let newProb = deal.probability;
        if (newStage === 'Won') newProb = 100;
        else if (newStage === 'Lost') newProb = 0;
        else if (newStage === 'Negotiation') newProb = 85;
        else if (newStage === 'Proposal') newProb = 65;
        else if (newStage === 'Qualified') newProb = 45;
        else if (newStage === 'New') newProb = 20;

        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id ? { ...d, stage: newStage, probability: newProb } : d
          ),
        }));

        if (newStage === 'Won') {
          get().logActivity('deal_won', `Deal Won! 🚀 ${deal.title}`, `$${Number(deal.value).toLocaleString()} revenue secured.`);
        } else {
          get().logActivity('stage_changed', `Stage Updated: ${deal.title}`, `Moved to "${newStage}" stage.`);
        }
      },
      deleteDeal: (id) => {
        const deal = get().deals.find((d) => d.id === id);
        set((state) => ({
          deals: state.deals.filter((d) => d.id !== id),
        }));
        if (deal) {
          get().logActivity('deal_deleted', `Deal Removed: ${deal.title}`, `Deleted from sales pipeline`);
        }
      },

      // Actions - Tasks
      addTask: (taskData) => {
        const id = `tsk-${Date.now()}`;
        const newTask = {
          id,
          completed: false,
          priority: taskData.priority || 'Medium',
          category: taskData.category || 'Follow-up',
          assignedTo: taskData.assignedTo || get().user.name,
          dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
          ...taskData,
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
        get().logActivity('task_created', `Task Created: ${newTask.title}`, `Due on ${newTask.dueDate}`);
        return newTask;
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },
      toggleTaskStatus: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        const newStatus = !task.completed;
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: newStatus } : t)),
        }));
        if (newStatus) {
          get().logActivity('task_completed', `Task Completed: ${task.title}`, `Marked as done.`);
        }
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      // Actions - Calendar Events
      addEvent: (eventData) => {
        const id = `ev-${Date.now()}`;
        const newEvent = {
          id,
          type: eventData.type || 'Meeting',
          attendees: eventData.attendees || [get().user.name],
          ...eventData,
        };
        set((state) => ({
          events: [...state.events, newEvent],
        }));
        get().logActivity('event_created', `Event Scheduled: ${newEvent.title}`, `${newEvent.date} at ${newEvent.time}`);
        return newEvent;
      },
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },

      // Reset Demo Data
      resetDemoData: () => {
        set({
          user: initialUser,
          workspace: initialWorkspace,
          contacts: initialContacts,
          leads: initialLeads,
          deals: initialDeals,
          tasks: initialTasks,
          events: initialEvents,
          activities: initialActivities,
        });
      },

      // Dynamic Metrics Getters
      getMetrics: () => {
        const { deals, contacts, leads, tasks } = get();
        const wonDeals = deals.filter((d) => d.stage === 'Won');
        const activeDeals = deals.filter((d) => d.stage !== 'Lost' && d.stage !== 'Won');
        const totalRevenue = wonDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
        const pipelineValue = activeDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
        const totalContacts = contacts.length;
        const activeLeads = leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length;
        const totalDeals = deals.length;
        const completedTasks = tasks.filter((t) => t.completed).length;
        const pendingTasks = tasks.filter((t) => !t.completed).length;

        const closedDealsCount = wonDeals.length + deals.filter((d) => d.stage === 'Lost').length;
        const winRate = closedDealsCount > 0 ? Math.round((wonDeals.length / closedDealsCount) * 100) : 78;

        return {
          totalRevenue,
          pipelineValue,
          totalContacts,
          activeLeads,
          totalDeals,
          completedTasks,
          pendingTasks,
          winRate,
        };
      },
    }),
    {
      name: 'nexora_crm_store_v1',
    }
  )
);


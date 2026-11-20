import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
  Mail,
  Phone,
  Building2,
  MoreVertical,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card3D } from '../../components/3d/Card3D';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ContactModal } from './ContactModal';
import { ContactDetailDrawer } from './ContactDetailDrawer';
import { exportToCsv } from '../../utils/exportCsv';
import { formatDate } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';
import { useToastStore } from '../../store/toastStore';

export const ContactsPage = () => {
  const { contacts, addContact, updateContact, deleteContact } = useCrmStore();
  const { addToast } = useToastStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  // Filter & Sort
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        const matchesSearch =
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === 'All' ? true : contact.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'company') return a.company.localeCompare(b.company);
        if (sortBy === 'date') return new Date(b.lastContacted) - new Date(a.lastContacted);
        return 0;
      });
  }, [contacts, searchQuery, statusFilter, sortBy]);

  const handleSaveContact = (formData) => {
    if (editingContact) {
      updateContact(editingContact.id, formData);
      addToast({
        title: 'Contact Updated',
        message: `${formData.name} was successfully updated.`,
        type: 'success',
      });
    } else {
      addContact(formData);
      addToast({
        title: 'Contact Created',
        message: `${formData.name} added to your address book.`,
        type: 'success',
      });
    }
    setEditingContact(null);
  };

  const handleDelete = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete.id);
      addToast({
        title: 'Contact Removed',
        message: `${contactToDelete.name} was deleted.`,
        type: 'info',
      });
      setContactToDelete(null);
    }
  };

  const handleExport = () => {
    const exportData = filteredContacts.map((c) => ({
      ID: c.id,
      Name: c.name,
      Role: c.role,
      Company: c.company,
      Email: c.email,
      Phone: c.phone,
      Status: c.status,
      Location: c.location,
      LastContacted: c.lastContacted,
      Notes: c.notes,
    }));
    exportToCsv(exportData, 'Nexora_Contacts_Directory.csv');
    addToast({
      title: 'Export Complete',
      message: `${exportData.length} contacts exported to CSV.`,
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
        title="Contacts Directory"
        subtitle="Manage executive relationships, stakeholders, and enterprise client profiles."
        breadcrumbs={[{ label: 'Contacts' }]}
        actions={
          <>
            <Button
              variant="secondary"
              icon={Download}
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setEditingContact(null);
                setModalOpen(true);
              }}
            >
              Add Contact
            </Button>
          </>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#151E30]/80 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-[#7967FF] text-xs sm:text-sm"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          {/* Status selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#7967FF]"
            >
              <option value="All">All Statuses</option>
              <option value="Customer">Customer</option>
              <option value="Active">Active</option>
              <option value="Lead">Lead</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#7967FF]"
            >
              <option value="name">Sort by Name</option>
              <option value="company">Sort by Company</option>
              <option value="date">Sort by Recent Touch</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-[#7967FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#7967FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      {filteredContacts.length === 0 ? (
        <EmptyState
          title="No contacts found"
          description="Try modifying your search filter or add a new executive contact."
          actionLabel="Add Contact"
          onAction={() => {
            setEditingContact(null);
            setModalOpen(true);
          }}
        />
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="rounded-2xl bg-[#151E30]/75 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-slate-400 text-xs uppercase font-semibold border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Executive</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Last Touch</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedContact(contact);
                      setDrawerOpen(true);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                        />
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                            {contact.name}
                          </div>
                          <div className="text-xs text-slate-400">{contact.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {contact.company}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={contact.status}>{contact.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <div className="text-slate-300 truncate">{contact.email}</div>
                        <div className="text-slate-500">{contact.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(contact.lastContacted)}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setDrawerOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingContact(contact);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setContactToDelete(contact);
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
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card3D
              key={contact.id}
              className="p-6 cursor-pointer"
              onClick={() => {
                setSelectedContact(contact);
                setDrawerOpen(true);
              }}
            >
              <div className="flex items-start justify-between">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#7967FF]/30 shadow-md"
                />
                <Badge status={contact.status}>{contact.status}</Badge>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                  {contact.name}
                </h3>
                <p className="text-xs text-[#38BDF8]">{contact.role}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{contact.company}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#7967FF] shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <span className="text-[11px] text-slate-500">
                  Touched {formatDate(contact.lastContacted)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingContact(contact);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setContactToDelete(contact);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveContact}
        contact={editingContact}
      />

      {/* Contact Profile Drawer */}
      <ContactDetailDrawer
        contact={selectedContact}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={(contact) => {
          setEditingContact(contact);
          setModalOpen(true);
        }}
        onDelete={(contact) => {
          setContactToDelete(contact);
          setDeleteConfirmOpen(true);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Contact"
        message={`Are you sure you want to remove ${contactToDelete?.name}? All associated timeline history will be archived.`}
      />
    </motion.div>
  );
};


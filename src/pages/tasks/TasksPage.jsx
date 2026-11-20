import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  User,
  Filter,
  Trash2,
  Edit2,
  CheckSquare,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card3D } from '../../components/3d/Card3D';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TaskModal } from './TaskModal';
import { formatDate } from '../../utils/formatters';
import { useCrmStore } from '../../store/crmStore';
import { useToastStore } from '../../store/toastStore';

export const TasksPage = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useCrmStore();
  const { addToast } = useToastStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'completed'
          ? task.completed
          : !task.completed;
      const matchesPriority =
        priorityFilter === 'all' ? true : task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleSaveTask = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
      addToast({
        title: 'Task Updated',
        message: 'Task details have been saved.',
        type: 'success',
      });
    } else {
      addTask(formData);
      addToast({
        title: 'Task Created',
        message: 'New deliverable added to your queue.',
        type: 'success',
      });
    }
    setEditingTask(null);
  };

  const handleDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      addToast({
        title: 'Task Deleted',
        message: 'Task was removed from list.',
        type: 'info',
      });
      setTaskToDelete(null);
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
        title="Tasks & Deliverables"
        subtitle="Manage deal closing actions, executive reviews, and stakeholder follow-ups."
        breadcrumbs={[{ label: 'Tasks' }]}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
          >
            Create Task
          </Button>
        }
      />

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#151E30]/75 border border-white/10 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Pending Actions</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Circle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151E30]/75 border border-white/10 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Completed Tasks</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151E30]/75 border border-white/10 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Completion Rate</div>
            <div className="text-2xl font-bold text-[#38BDF8] mt-1">
              {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/20">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#151E30]/80 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, assignees..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-[#7967FF] text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            {['all', 'pending', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  statusFilter === tab
                    ? 'bg-[#7967FF] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#7967FF]"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="You are all caught up on deliverables!"
          actionLabel="Create Task"
          onAction={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                task.completed
                  ? 'bg-emerald-500/[0.03] border-emerald-500/10 opacity-70'
                  : 'bg-[#151E30]/75 hover:bg-[#151E30] border-white/10 hover:border-[#7967FF]/30'
              } backdrop-blur-xl`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              {/* Task Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold leading-snug ${
                      task.completed ? 'line-through text-slate-500' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <Badge status={task.priority} size="xs">
                    {task.priority}
                  </Badge>
                </div>

                {task.description && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Due {formatDate(task.dueDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {task.assignedTo}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] text-slate-300">
                    {task.category}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setEditingTask(task);
                    setModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                  title="Edit Task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTaskToDelete(task);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Delete action item "${taskToDelete?.title}"?`}
      />
    </motion.div>
  );
};


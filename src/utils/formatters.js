// Format currency (e.g. $148,250)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format compact currency (e.g. $1.4M or $250K)
export const formatCompactCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

// Format date (e.g. Nov 20, 2026)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Relative time (e.g. "2 hours ago", "Yesterday")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
};

// Status badge color mapping
export const getStatusColor = (status) => {
  const map = {
    // Contacts & Leads
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    Customer: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Lead: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    
    // Lead stages
    New: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Contacted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Qualified: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Proposal: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Converted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Lost: 'bg-rose-500/10 text-rose-400 border-rose-500/20',

    // Deal stages
    Negotiation: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Won: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',

    // Tasks & Priorities
    Low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/20',

    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return map[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
};


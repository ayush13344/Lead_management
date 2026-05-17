import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import LeadModal from '../components/LeadModal';
import Pagination from '../components/Pagination';
import { fetchLeads, createLead, updateLead, deleteLead, exportCSV } from '../api/leads';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { Lead, LeadFilters, LeadFormData, PaginationMeta, LeadStatus, LeadSource } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    status: '',
    source: '',
    sort: 'latest',
    page: 1,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchLeads({ ...filters, search: debouncedSearch });
      setLeads(result.data);
      setPagination(result.pagination);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Reset page when filters change (except page itself)
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.status, filters.source, filters.sort]);

  const handleCreate = async (data: LeadFormData) => {
    await createLead(data);
    toast.success('Lead created!');
    loadLeads();
  };

  const handleUpdate = async (data: LeadFormData) => {
    if (!editingLead) return;
    await updateLead(editingLead._id, data);
    toast.success('Lead updated!');
    loadLeads();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      loadLeads();
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggleDark = () => {
    setDarkMode((d) => {
      document.documentElement.classList.toggle('dark', !d);
      return !d;
    });
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {pagination?.total ?? 0} total leads
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => { setEditingLead(null); setShowModal(true); }}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              + New Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as LeadStatus | '' })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">All Status</option>
              {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value as LeadSource | '' })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">All Sources</option>
              {(['Website', 'Instagram', 'Referral'] as LeadSource[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value as 'latest' | 'oldest' })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-lg font-medium">No leads found</p>
              <p className="text-sm mt-1">Try adjusting your filters or create a new lead</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="text-left px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Name</th>
                      <th className="text-left px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Email</th>
                      <th className="text-left px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-left px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Source</th>
                      <th className="text-left px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Created</th>
                      <th className="text-right px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{lead.email}</td>
                        <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{lead.source}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setEditingLead(lead); setShowModal(true); }}
                              className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                            >
                              Edit
                            </button>
                            {user?.role === 'admin' && (
                              <button
                                onClick={() => handleDelete(lead._id)}
                                className="text-red-500 hover:text-red-600 font-medium text-sm"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                  <Pagination
                    meta={pagination}
                    onPageChange={(p) => setFilters({ ...filters, page: p })}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showModal && (
        <LeadModal
          lead={editingLead}
          onClose={() => { setShowModal(false); setEditingLead(null); }}
          onSubmit={editingLead ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
};

export default Dashboard;
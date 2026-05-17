import api from './axios';
import { LeadsResponse, Lead, LeadFormData, LeadFilters } from '../types';

export const fetchLeads = async (filters: LeadFilters): Promise<LeadsResponse> => {
  const params = new URLSearchParams();
  params.append('page', filters.page.toString());
  params.append('sort', filters.sort);
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.source) params.append('source', filters.source);

  const res = await api.get<LeadsResponse>(`/leads?${params.toString()}`);
  return res.data;
};

export const createLead = async (data: LeadFormData): Promise<Lead> => {
  const res = await api.post<{ success: boolean; data: Lead }>('/leads', data);
  return res.data.data;
};

export const updateLead = async (id: string, data: Partial<LeadFormData>): Promise<Lead> => {
  const res = await api.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data);
  return res.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportCSV = (): void => {
  const stored = localStorage.getItem('user');
  const token = stored ? (JSON.parse(stored) as { token: string }).token : '';
  const link = document.createElement('a');
  link.href = `/api/leads/export/csv`;
  // We need auth header - use fetch approach
  fetch('/api/leads/export/csv', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'leads.csv';
      link.click();
      URL.revokeObjectURL(url);
    });
};
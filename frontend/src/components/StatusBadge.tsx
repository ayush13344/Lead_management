import React from 'react';
import { LeadStatus } from '../types';

const colors: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Qualified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
    {status}
  </span>
);

export default StatusBadge;
import React from 'react';

const STATUS_COLORS = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'danger',
  COMPLETED: 'info',
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || 'secondary';
  return <span className={`badge bg-${color}-subtle text-${color}`}>{status}</span>;
}

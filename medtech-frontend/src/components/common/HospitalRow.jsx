import React from 'react';

export default function HospitalRow({ hospital }) {
  const statusColor = hospital.approved ? 'success' : 'warning';
  const statusLabel = hospital.approved ? 'Approved' : 'Pending';

  return (
    <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
      <div>
        <div className="fw-semibold">{hospital.name}</div>
        <div className="text-muted small">{hospital.address}</div>
        <div className="text-muted small">{hospital.contact}</div>
      </div>
      <span className={`badge bg-${statusColor}-subtle text-${statusColor}`}>
        {statusLabel}
      </span>
    </div>
  );
}

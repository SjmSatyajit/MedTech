import React, { useEffect, useState } from 'react';
import { getMyHospital } from '../../api/hospitalAPI';
import StockManager from './StockManager';
import IncomingRequests from './IncomingRequests';

export default function SupplierDashboard() {
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    getMyHospital().then(res => setHospital(res.data));
  }, []);

  if (!hospital) return <p className="text-muted">Loading hospital info...</p>;

  return (
    <div className="animated-fade-in">
      <div className="glass-card p-4 mb-4">
        <h4 className="mb-1" style={{ color: 'var(--text-primary)' }}>{hospital.name}</h4>
        <span className="text-muted small">{hospital.address} | {hospital.contact}</span>
      </div>
      <div className="row g-4">
        <div className="col-md-7">
          <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>Stock Manager</h5>
          <StockManager hospitalId={hospital.hospitalId} />
        </div>
        <div className="col-md-5">
          <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>Incoming Requests</h5>
          <IncomingRequests hospitalId={hospital.hospitalId} />
        </div>
      </div>
    </div>
  );
}

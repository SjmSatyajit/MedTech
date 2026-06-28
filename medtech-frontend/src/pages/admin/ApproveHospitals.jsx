import React, { useEffect, useState } from 'react';
import { getPendingHospitals, approveHospital } from '../../api/hospitalAPI';
import { toast } from 'react-toastify';

export default function ApproveHospitals() {
  const [hospitals, setHospitals] = useState([]);

  const fetchPending = () => {
    getPendingHospitals().then(res => setHospitals(res.data));
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveHospital(id);
      toast.success('Hospital approved');
      setHospitals(prev => prev.filter(h => h.hospitalId !== id));
    } catch {
      toast.error('Failed to approve');
    }
  };

  if (hospitals.length === 0) {
    return <p className="text-muted">No pending hospitals.</p>;
  }

  return (
    <div className="card" style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map(h => (
              <tr key={h.hospitalId}>
                <td className="fw-semibold">{h.name}</td>
                <td className="text-muted small">{h.address}</td>
                <td>{h.contact}</td>
                <td><span className="badge bg-info bg-opacity-10 text-info">{h.type}</span></td>
                <td>
                  <button className="btn btn-sm btn-success"
                    onClick={() => handleApprove(h.hospitalId)}>Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

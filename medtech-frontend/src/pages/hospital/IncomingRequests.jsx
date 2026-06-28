import React, { useEffect, useState, useCallback } from 'react';
import { getPendingHospitalBookings, updateBookingStatus } from '../../api/bookingAPI';
import { toast } from 'react-toastify';

export default function IncomingRequests({ hospitalId }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = useCallback(() => {
    getPendingHospitalBookings(hospitalId).then(res => setRequests(res.data));
  }, [hospitalId]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchRequests();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (requests.length === 0) {
    return <p className="text-muted">No pending requests.</p>;
  }

  return (
    <div>
      {requests.map(r => (
        <div key={r.bookingId} className="glass-card mb-2">
          <div className="card-body py-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div className="fw-semibold small">{r.patientName}</div>
                <div className="text-muted small">{r.resourceType?.replace('_', ' ')} x {r.quantity}</div>
                {r.urgent && <span className="badge bg-danger bg-opacity-10 text-danger" style={{ fontSize: 10 }}>URGENT</span>}
              </div>
              <span className="badge bg-warning bg-opacity-10 text-warning">PENDING</span>
            </div>
            {r.notes && <p className="small text-muted mb-2">{r.notes}</p>}
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success flex-fill"
                onClick={() => handleStatus(r.bookingId, 'CONFIRMED')}
                style={{ borderRadius: 6 }}>Accept</button>
              <button className="btn btn-sm btn-outline-danger flex-fill"
                onClick={() => handleStatus(r.bookingId, 'CANCELLED')}
                style={{ borderRadius: 6 }}>Reject</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

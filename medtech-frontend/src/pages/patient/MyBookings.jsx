import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../../api/bookingAPI';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animated-fade-in">
      <h4 className="page-title mb-4">My Bookings</h4>
      {bookings.length === 0 ? (
        <div className="glass-card p-5 text-center">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p className="text-muted mb-0">No bookings yet. Go to Dashboard to book resources.</p>
        </div>
      ) : (
        <div className="glass-card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Hospital</th>
                  <th>Resource</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Urgent</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.bookingId}>
                    <td className="fw-semibold">{b.hospitalName}</td>
                    <td>{b.resourceType?.replace('_', ' ')}</td>
                    <td>{b.quantity}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>{b.urgent ? <span className="badge bg-danger">Yes</span> : 'No'}</td>
                    <td style={{ fontSize: 13 }}>{formatDateTime(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

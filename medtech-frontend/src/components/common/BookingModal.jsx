import React, { useState } from 'react';
import { createBooking } from '../../api/bookingAPI';
import { toast } from 'react-toastify';

export default function BookingModal({ resource, onClose }) {
  const [qty, setQty]       = useState(1);
  const [notes, setNotes]   = useState('');
  const [urgent, setUrgent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createBooking({
        resourceId: resource.resourceId,
        quantity: qty,
        notes,
        urgent,
      });
      toast.success(`Booking submitted for ${resource.hospitalName}`);
      onClose();
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1050 }}>
      <div className="modal-dialog">
        <div className="modal-content" style={{ borderRadius: 16 }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title" style={{ color: 'var(--text-primary)' }}>Confirm Booking</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="bg-light rounded p-3 mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Hospital</span>
                <strong style={{ color: 'var(--text-primary)' }}>{resource.hospitalName}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Resource</span>
                <strong style={{ color: 'var(--text-primary)' }}>{resource.subType} {resource.resourceType.replace('_', ' ')}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Distance</span>
                <span style={{ color: 'var(--text-primary)' }}>{resource.distanceKm} km</span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small">Quantity</label>
              <input type="number" className="form-control" min="1"
                value={qty} onChange={e => setQty(Number(e.target.value))} />
            </div>
            <div className="mb-3">
              <label className="form-label small">Notes</label>
              <input type="text" className="form-control"
                placeholder="e.g. Patient details, urgency info"
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="urgent"
                checked={urgent} onChange={e => setUrgent(e.target.checked)} />
              <label className="form-check-label" htmlFor="urgent" style={{ color: 'var(--text-primary)' }}>
                Mark as urgent
              </label>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button className="btn btn-outline-secondary" onClick={onClose}
              style={{ borderRadius: 8 }}>Cancel</button>
            <button className="btn btn-danger" onClick={handleSubmit} disabled={loading}
              style={{ borderRadius: 8 }}>
              {loading ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

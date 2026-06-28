import React, { useState } from 'react';
import API from '../../api/axiosConfig';
import { toast } from 'react-toastify';

export default function SOSModal({ onClose }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await API.post('/sos', { message });
      toast.success('SOS alert sent to nearby hospitals!');
      onClose();
    } catch (err) {
      toast.error('Failed to send SOS. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1050 }}>
      <div className="modal-dialog">
        <div className="modal-content" style={{ borderRadius: 16 }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title text-danger">SOS Emergency</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <p className="text-muted small mb-3">
              This will alert nearby hospitals about your emergency.
            </p>
            <div className="mb-3">
              <label className="form-label small">Message</label>
              <textarea className="form-control" rows="3"
                placeholder="Describe your emergency..."
                value={message} onChange={e => setMessage(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer border-0">
            <button className="btn btn-outline-secondary" onClick={onClose}
              style={{ borderRadius: 8 }}>Cancel</button>
            <button className="btn btn-danger" onClick={handleSubmit} disabled={loading}
              style={{ borderRadius: 8 }}>
              {loading ? 'Sending...' : 'Send SOS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

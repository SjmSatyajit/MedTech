import React, { useEffect, useState, useCallback } from 'react';
import { getNearbyResources } from '../../api/resourceAPI';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useWebSocket } from '../../hooks/useWebSocket';
import ResourceCard from '../../components/common/ResourceCard';
import SOSModal from '../../components/common/SOSModal';
import BookingModal from '../../components/common/BookingModal';

const RESOURCE_TYPES = ['All', 'BLOOD', 'ICU_BED', 'OXYGEN_CYLINDER', 'AMBULANCE'];

export default function Dashboard() {
  const { location } = useGeolocation();
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('All');
  const [radius, setRadius] = useState(10);
  const [selected, setSelected] = useState(null);
  const [showSOS, setShowSOS] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const type = filter === 'All' ? null : filter;
      const res = await getNearbyResources(location.lat, location.lng, radius, type);
      setResources(res.data);
    } finally {
      setLoading(false);
    }
  }, [location, radius, filter]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const handleStockUpdate = useCallback(({ resourceId, newQuantity }) => {
    setResources(prev =>
      prev.map(r => r.resourceId === resourceId ? { ...r, quantity: newQuantity } : r)
    );
  }, []);
  useWebSocket(handleStockUpdate);

  const grouped = RESOURCE_TYPES.slice(1).map(type => ({
    type,
    total: resources.filter(r => r.resourceType === type)
                    .reduce((sum, r) => sum + r.quantity, 0),
  }));

  return (
    <div className="animated-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="page-title mb-0">Nearby Resources</h4>
        <button className="btn btn-danger" onClick={() => setShowSOS(true)}
          style={{ borderRadius: 8 }}>
          SOS Emergency
        </button>
      </div>

      <div className="row g-3 mb-4">
        {grouped.map(g => (
          <div className="col-md-3" key={g.type}>
            <div className="stat-card glass-card">
              <div className="text-muted small">{g.type.replace('_', ' ')}</div>
              <div className="fs-3 fw-semibold">{g.total}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        {RESOURCE_TYPES.map(t => (
          <button key={t}
            className={`btn btn-sm ${filter === t ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(t)}
            style={{ borderRadius: 6 }}
          >{t === 'All' ? 'All' : t.replace('_', ' ')}</button>
        ))}
        <div className="ms-auto d-flex gap-2">
          {[5, 10, 20].map(r => (
            <button key={r}
              className={`btn btn-sm ${radius === r ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setRadius(r)}>{r} km</button>
          ))}
        </div>
      </div>

      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="row g-3 mb-4">
          {resources.map(r => (
            <div className="col-md-4" key={r.resourceId}>
              <ResourceCard resource={r} onBook={() => setSelected(r)} />
            </div>
          ))}
          {resources.length === 0 && (
            <p className="text-muted">No resources found in this area.</p>
          )}
        </div>
      )}

      {selected && (
        <BookingModal resource={selected} onClose={() => setSelected(null)} />
      )}
      {showSOS && (
        <SOSModal onClose={() => setShowSOS(false)} />
      )}
    </div>
  );
}

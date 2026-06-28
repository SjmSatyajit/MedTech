import React, { useEffect, useState, useCallback } from 'react';
import { getNearbyResources } from '../../api/resourceAPI';
import { useGeolocation } from '../../hooks/useGeolocation';
import ResourceMap from '../../components/map/ResourceMap';
import ResourceCard from '../../components/common/ResourceCard';
import BookingModal from '../../components/common/BookingModal';

export default function SearchMap() {
  const { location } = useGeolocation();
  const [resources, setResources] = useState([]);
  const [radius, setRadius] = useState(10);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
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

  return (
    <div className="animated-fade-in">
      <h4 className="page-title mb-4">Search Resources on Map</h4>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        {['All', 'BLOOD', 'ICU_BED', 'OXYGEN_CYLINDER', 'AMBULANCE'].map(t => (
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

      <div className="mb-4">
        <ResourceMap resources={resources} userLocation={location} radius={radius} />
      </div>

      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="row g-3">
          {resources.map(r => (
            <div className="col-md-4" key={r.resourceId}>
              <ResourceCard resource={r} onBook={() => setSelected(r)} />
            </div>
          ))}
        </div>
      )}

      {selected && (
        <BookingModal resource={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

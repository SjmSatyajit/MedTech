import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const TYPE_STYLES = {
  BLOOD: { accent: '#ff6b6b', icon: '🩸' },
  ICU_BED: { accent: '#5b9aff', icon: '🛏️' },
  OXYGEN_CYLINDER: { accent: '#4ade80', icon: '⚗️' },
  AMBULANCE: { accent: '#fbbf24', icon: '🚑' },
};

export default function ResourceCard({ resource, onBook }) {
  const { theme } = useTheme();
  const style = TYPE_STYLES[resource.resourceType] || TYPE_STYLES.BLOOD;
  const pct = Math.min(100, Math.round((resource.quantity / (resource.quantity + 10)) * 100));
  const statusLabel = resource.quantity > 10 ? 'Available' : resource.quantity > 3 ? 'Limited' : 'Critical';
  const statusColor = resource.quantity > 10 ? 'success' : resource.quantity > 3 ? 'warning' : 'danger';

  return (
    <div className="card h-100" style={{
      borderRadius: 12,
      background: theme === 'dark' ? 'linear-gradient(135deg, #2a1a4e 0%, #1e1040 100%)' : '#fff',
      border: theme === 'dark' ? '1px solid rgba(160, 120, 255, 0.15)' : '1px solid var(--border-color)',
    }}>
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div style={{
            background: theme === 'dark' ? `${style.accent}22` : `${style.accent}18`,
            color: style.accent, width: 36, height: 36,
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>
            {style.icon}
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: 14, color: 'var(--text-primary)' }}>
              {resource.subType ? `${resource.subType} ${resource.resourceType.replace('_', ' ')}` : resource.resourceType.replace('_', ' ')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{resource.hospitalName}</div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold fs-5" style={{ color: style.accent }}>
            {resource.quantity} <span className="fw-normal fs-6" style={{ color: 'var(--text-secondary)' }}>{resource.unit}</span>
          </span>
          <span className={`badge bg-${statusColor}-subtle text-${statusColor}`}>{statusLabel}</span>
        </div>
        <div className="progress mb-3" style={{ height: 4, background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : undefined }}>
          <div className={`progress-bar bg-${statusColor}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small style={{ color: 'var(--text-secondary)' }}>{resource.distanceKm} km away</small>
          <button className="btn btn-sm btn-danger" onClick={onBook}
            style={{ borderRadius: 6 }}>Book now</button>
        </div>
      </div>
    </div>
  );
}

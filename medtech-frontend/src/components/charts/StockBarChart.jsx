import React from 'react';

const TYPE_COLORS = {
  BLOOD: '#e24b4a', ICU_BED: '#185fa5',
  OXYGEN_CYLINDER: '#0f6e56', AMBULANCE: '#854f0b',
};

export default function StockBarChart({ data }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div>
      {data.map(item => (
        <div key={item.type} className="mb-3">
          <div className="d-flex justify-content-between small mb-1">
            <span>{item.type.replace('_', ' ')}</span>
            <span className="fw-semibold">{item.total}</span>
          </div>
          <div className="progress" style={{ height: 8, borderRadius: 4 }}>
            <div className="progress-bar" style={{
              width: `${(item.total / max) * 100}%`,
              background: TYPE_COLORS[item.type] || '#888',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

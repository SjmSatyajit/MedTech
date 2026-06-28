import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createColoredIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};
                border:2px solid white;display:flex;align-items:center;justify-content:center;
                color:white;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">+</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const TYPE_COLORS = {
  BLOOD: '#e24b4a', ICU_BED: '#185fa5',
  OXYGEN_CYLINDER: '#0f6e56', AMBULANCE: '#854f0b',
};

export default function ResourceMap({ resources, userLocation, radius }) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: 400, borderRadius: 12 }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={radius * 1000}
        pathOptions={{ color: '#e24b4a', fillColor: '#e24b4a', fillOpacity: 0.05, dashArray: '5,5' }}
      />
      {resources.map(r => (
        <Marker
          key={r.resourceId}
          position={[r.latitude, r.longitude]}
          icon={createColoredIcon(TYPE_COLORS[r.resourceType] || '#888')}
        >
          <Popup>
            <strong>{r.hospitalName}</strong><br/>
            {r.subType} {r.resourceType.replace('_', ' ')}<br/>
            <span style={{ color: r.quantity > 5 ? 'green' : 'red' }}>
              {r.quantity} {r.unit} available
            </span><br/>
            {r.distanceKm} km away
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

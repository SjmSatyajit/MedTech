import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const patientLinks = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/map', label: 'Search Map', icon: '🗺️' },
    { to: '/bookings', label: 'My Bookings', icon: '📋' },
  ];

  const hospitalLinks = [
    { to: '/supplier', label: 'Dashboard', icon: '📊' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
  ];

  const links = user?.role === 'HOSPITAL' ? hospitalLinks
    : user?.role === 'ADMIN' ? adminLinks
    : patientLinks;

  return (
    <div style={{
      width: 220, background: 'var(--sidebar-bg)', color: '#fff',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #2a2d3a' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>
          <span style={{ color: '#6c8cff' }}>Med</span>Tech
        </div>
        <div style={{ fontSize: 11, color: '#888' }}>Resource Management</div>
      </div>
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', color: isActive ? '#fff' : 'var(--sidebar-text)',
              background: isActive ? 'var(--sidebar-active)' : 'transparent',
              textDecoration: 'none', fontSize: 14,
              margin: '2px 8px', borderRadius: 8,
              transition: 'all 0.2s ease',
            })}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{
        padding: '16px', borderTop: '1px solid #2a2d3a',
        fontSize: 11, color: '#666', textAlign: 'center',
      }}>
        MedTech v1.0
      </div>
    </div>
  );
}

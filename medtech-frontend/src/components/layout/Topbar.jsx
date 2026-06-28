import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      padding: '10px 24px', borderBottom: '1px solid var(--border-color)',
      background: 'var(--topbar-bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{user?.name}</div>
        <span style={{
          fontSize: 11, background: 'var(--bg-input)', padding: '2px 8px',
          borderRadius: 4, color: 'var(--text-secondary)',
        }}>
          {user?.role}
        </span>
        <button
          onClick={logout}
          style={{
            border: '1px solid var(--border-color)', background: 'none', borderRadius: 6,
            padding: '4px 12px', fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

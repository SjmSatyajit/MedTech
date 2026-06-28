import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/authAPI';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, code, newPassword });
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--login-bg)',
      position: 'relative',
    }}>
      <div className="medical-bg-anim">
        <div className="med-cross" style={{ top: '15%', left: '8%', animationDelay: '0s', fontSize: 26, opacity: 0.1 }}>+</div>
        <div className="med-cross" style={{ top: '60%', right: '10%', animationDelay: '2s', fontSize: 20, opacity: 0.08 }}>+</div>
        <div className="med-pulse" style={{ top: '30%', left: '60%', width: 200, height: 200, animationDelay: '0s' }} />
      </div>
      <button className="theme-toggle-btn" onClick={toggleTheme}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className="glass-card animated-fade-in" style={{
        width: 420, padding: 0, position: 'relative', zIndex: 2,
        border: '1px solid var(--login-card-border)',
      }}>
        <div className="card-header-grad">
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>
            <span style={{ color: '#6c8cff' }}>Med</span>Tech
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Set new password</div>
        </div>
        <div style={{ padding: '24px 32px 32px' }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small">Email</label>
              <input type="email" className="form-control" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email" />
            </div>
            <div className="mb-3">
              <label className="form-label small">Reset Code</label>
              <input type="text" className="form-control" required
                value={code} onChange={e => setCode(e.target.value)}
                placeholder="Enter the reset code" />
            </div>
            <div className="mb-3">
              <label className="form-label small">New Password</label>
              <input type="password" className="form-control" required
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)" />
            </div>
            <button className="btn btn-danger w-100 mb-3" disabled={loading}
              style={{ padding: '10px', borderRadius: 8 }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              <Link to="/login" style={{ color: '#6c8cff', textDecoration: 'none', fontWeight: 500 }}>
                Back to Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authAPI';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Reset code sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset code');
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
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Reset your password</div>
        </div>
        <div style={{ padding: '24px 32px 32px' }}>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Enter your email address and we'll send you a code to reset your password.
              </p>
              <div className="mb-3">
                <label className="form-label small">Email</label>
                <input type="email" className="form-control" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your registered email" />
              </div>
              <button className="btn btn-danger w-100 mb-3" disabled={loading}
                style={{ padding: '10px', borderRadius: 8 }}>
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
                Remember your password?{' '}
                <Link to="/login" style={{ color: '#6c8cff', textDecoration: 'none', fontWeight: 500 }}>
                  Sign in
                </Link>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Reset code sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
                Use the code to reset your password on the next page.
              </p>
              <Link to="/reset-password" className="btn btn-danger w-100 mb-3"
                style={{ padding: '10px', borderRadius: 8, textDecoration: 'none' }}>
                Go to Reset Password
              </Link>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
                <Link to="/login" style={{ color: '#6c8cff', textDecoration: 'none', fontWeight: 500 }}>
                  Back to Sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

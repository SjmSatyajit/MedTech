import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const gridDots = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: `${(i % 10) * 10 + 5 + Math.random() * 4}%`,
  top: `${Math.floor(i / 10) * 14 + 5 + Math.random() * 8}%`,
  delay: `${Math.random() * 5}s`,
}));

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'HOSPITAL') navigate('/supplier');
      else if (user.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--login-bg)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="auth-bg">
        <div className="bg-mesh" />
        <div className="auth-ambient" />
        <div className="ambient-orb" style={{
          top: '10%', left: '5%', width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(120,80,200,0.35) 0%, transparent 70%)',
          animationDelay: '0s',
        }} />
        <div className="ambient-orb" style={{
          bottom: '5%', right: '10%', width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(100,60,200,0.3) 0%, transparent 70%)',
          animationDelay: '-7s',
        }} />
        <div className="ambient-orb" style={{
          top: '50%', left: '60%', width: 220, height: 220,
          background: 'radial-gradient(circle, rgba(160,100,255,0.25) 0%, transparent 70%)',
          animationDelay: '-14s',
        }} />
        <div className="scan-line" style={{ animationDelay: '0s' }} />
        <div className="scan-line" style={{ animationDelay: '-4s' }} />
        {gridDots.map(d => (
          <div key={d.id} className="grid-dot" style={{ left: d.left, top: d.top, animationDelay: d.delay }} />
        ))}
        <div className="med-symbol" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>+</div>
      </div>

      <button className="theme-toggle-btn" onClick={toggleTheme}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="auth-card">
        <div className="card-header-grad">
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>
            <span style={{ color: '#a078ff' }}>Med</span>Tech
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Sign in to your account</div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small" style={{ color: '#d0c8e8' }}>Email</label>
              <input type="email" className="form-control" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email" />
            </div>
            <div className="mb-2">
              <label className="form-label small" style={{ color: '#d0c8e8' }}>Password</label>
              <input type="password" className="form-control" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" />
            </div>
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <Link to="/forgot-password"
                style={{ fontSize: 12, color: '#a078ff', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <button className="btn btn-danger w-100 mb-3" disabled={loading}
              style={{ padding: '10px', borderRadius: 8 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#b0a8c8' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#a078ff', textDecoration: 'none', fontWeight: 500 }}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authAPI';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const gridDots = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: `${(i % 10) * 10 + 5 + Math.random() * 4}%`,
  top: `${Math.floor(i / 10) * 14 + 5 + Math.random() * 8}%`,
  delay: `${Math.random() * 5}s`,
}));

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'PATIENT', contact: '' });
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'contact') {
      const digits = e.target.value.replace(/\D/g, '');
      setForm({ ...form, contact: digits });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const contactLen = form.contact.length;
  const contactError = contactLen > 10 ? 'Limit exceeded (max 10 digits)' : (contactLen > 0 && contactLen < 10 ? 'Must be 10 digits' : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--login-bg)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="auth-bg">
        <div className="bg-mesh" />
        <div className="auth-ambient" />
        <div className="ambient-orb" style={{
          top: '5%', right: '5%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(120,80,200,0.35) 0%, transparent 70%)',
          animationDelay: '-2s',
        }} />
        <div className="ambient-orb" style={{
          bottom: '10%', left: '8%', width: 260, height: 260,
          background: 'radial-gradient(circle, rgba(100,60,200,0.3) 0%, transparent 70%)',
          animationDelay: '-8s',
        }} />
        <div className="ambient-orb" style={{
          top: '40%', left: '55%', width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(160,100,255,0.25) 0%, transparent 70%)',
          animationDelay: '-15s',
        }} />
        <div className="scan-line" style={{ animationDelay: '-2s' }} />
        <div className="scan-line" style={{ animationDelay: '-6s' }} />
        {gridDots.map(d => (
          <div key={d.id} className="grid-dot" style={{ left: d.left, top: d.top, animationDelay: d.delay }} />
        ))}
        <div className="med-symbol" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>+</div>
      </div>

      <button className="theme-toggle-btn" onClick={toggleTheme}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="auth-card auth-card-wide">
        <div className="card-header-grad">
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>
            <span style={{ color: '#a078ff' }}>Med</span>Tech
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Create a new account</div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small" style={{ color: '#d0c8e8' }}>Full Name</label>
              <input type="text" name="name" className="form-control" required
                value={form.name} onChange={handleChange} placeholder="Enter your name" />
            </div>
            <div className="mb-3">
              <label className="form-label small" style={{ color: '#d0c8e8' }}>Email</label>
              <input type="email" name="email" className="form-control" required
                value={form.email} onChange={handleChange} placeholder="Enter your email" />
            </div>
            <div className="mb-3">
              <label className="form-label small" style={{ color: '#d0c8e8' }}>Password</label>
              <input type="password" name="password" className="form-control" required
                value={form.password} onChange={handleChange} placeholder="Create a password" />
            </div>
            <div className="mb-3">
              <label className="form-label small" style={{ color: '#d0c8e8' }}>Contact</label>
              <input type="text" name="contact" className="form-control"
                value={form.contact} onChange={handleChange} placeholder="Phone number"
                style={contactError ? { borderColor: '#dc3545' } : {}} />
              {contactError && (
                <small style={{ color: '#ff6b6b', fontSize: 11 }}>{contactError}</small>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label small" style={{ color: '#d0c8e8' }}>I am a</label>
              <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                <option value="PATIENT">Patient</option>
                <option value="HOSPITAL">Hospital</option>
              </select>
            </div>
            <button className="btn btn-danger w-100 mb-3" disabled={loading}
              style={{ padding: '10px', borderRadius: 8 }}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#b0a8c8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a078ff', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

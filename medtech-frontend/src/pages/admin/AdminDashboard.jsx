import React, { useEffect, useState } from 'react';
import ApproveHospitals from './ApproveHospitals';
import { getAllUsers } from '../../api/hospitalAPI';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    getAllUsers().then(res => setUsers(res.data));
  }, []);

  return (
    <div className="animated-fade-in">
      <h4 className="page-title mb-4">Admin Dashboard</h4>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card glass-card">
            <div className="text-muted small">Total Users</div>
            <div className="fs-3 fw-bold">{users.length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card glass-card">
            <div className="text-muted small">Active</div>
            <div className="fs-3 fw-bold">{users.filter(u => u.enabled).length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card glass-card">
            <div className="text-muted small">Roles</div>
            <div className="fs-3 fw-bold">
              {['ADMIN', 'HOSPITAL', 'PATIENT'].map(r =>
                users.filter(u => u.role === r).length
              ).join('/')}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button className="btn btn-outline-danger btn-sm" onClick={() => setShowUsers(!showUsers)}>
          {showUsers ? 'Hide' : 'Show'} All Users
        </button>
      </div>

      {showUsers && (
        <div className="glass-card mb-4">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password (Hash)</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Enabled</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="fw-semibold">{u.name}</td>
                    <td style={{ fontSize: 12 }}>{u.email}</td>
                    <td style={{ fontSize: 11, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <code style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{u.password}</code>
                    </td>
                    <td><span className="badge bg-info bg-opacity-10 text-info">{u.role}</span></td>
                    <td>{u.phone || '-'}</td>
                    <td>{u.enabled ? <span className="badge bg-success">Yes</span> : <span className="badge bg-danger">No</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h5 className="mb-3">Pending Hospital Approvals</h5>
        <ApproveHospitals />
      </div>
    </div>
  );
}

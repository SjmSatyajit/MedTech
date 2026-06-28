import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-danger me-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="text-muted">{text}</span>
    </div>
  );
}

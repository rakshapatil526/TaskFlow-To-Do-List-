import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, task, onClose, onConfirm, loading }) {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-body" style={{ textAlign: 'center', paddingTop: '32px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <AlertTriangle size={26} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            Delete Task?
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '8px' }}>
            Are you sure you want to delete <strong style={{ color: '#0f172a' }}>"{task.title}"</strong>?
          </p>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            This action will permanently delete the record from the PostgreSQL database.
          </span>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(task)}
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

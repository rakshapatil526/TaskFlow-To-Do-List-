import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  Trash2 
} from 'lucide-react';

export default function TaskDetailModal({ 
  isOpen, 
  task, 
  onClose, 
  onEdit, 
  onDelete, 
  onMarkComplete 
}) {
  if (!isOpen || !task) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge-priority-high';
      case 'Medium': return 'badge-priority-medium';
      case 'Low': return 'badge-priority-low';
      default: return 'badge-priority-medium';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge-status-completed';
      case 'In Progress': return 'badge-status-inprogress';
      case 'To Do': return 'badge-status-todo';
      default: return 'badge-status-todo';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${getStatusBadgeClass(task.status)}`}>
              {task.status}
            </span>
            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
              <Flag size={11} />
              {task.priority} Priority
            </span>
            {task.is_overdue && (
              <span className="badge badge-overdue">
                <AlertTriangle size={11} />
                Overdue
              </span>
            )}
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '16px',
            lineHeight: '1.3'
          }}>
            {task.title}
          </h2>

          {/* Description Section */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', marginBottom: '8px', letterSpacing: '0.5px' }}>
              Description
            </h4>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.92rem',
              color: '#334155',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {task.description || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No detailed description provided for this task.</span>}
            </div>
          </div>

          {/* Schedule Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>
                <Calendar size={14} />
                <span>START DATE</span>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
                {formatDate(task.start_date)}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>
                <Clock size={14} />
                <span>DUE DATE</span>
              </div>
              <div style={{ 
                fontSize: '0.92rem', 
                fontWeight: '700', 
                color: task.is_overdue ? '#dc2626' : '#0f172a' 
              }}>
                {formatDate(task.due_date)}
              </div>
            </div>
          </div>

          {/* Database Details */}
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
            <span>Task ID: #{task.task_id}</span>
            <span>Created: {new Date(task.created_date).toLocaleString()}</span>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {task.status !== 'Completed' && (
              <button
                onClick={() => { onMarkComplete(task); onClose(); }}
                className="btn btn-sm btn-success"
              >
                <CheckCircle2 size={15} />
                <span>Mark as Complete</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { onEdit(task); onClose(); }}
              className="btn btn-sm btn-secondary"
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => { onDelete(task); onClose(); }}
              className="btn btn-sm btn-danger"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

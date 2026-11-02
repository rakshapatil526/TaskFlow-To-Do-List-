import React from 'react';
import { 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Flag
} from 'lucide-react';

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onMarkComplete,
  onViewDetails,
  onStatusChange 
}) {
  const isCompleted = task.status === 'Completed';

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

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div 
      className="card fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
        borderLeft: task.priority === 'High' 
          ? '4px solid #ef4444' 
          : task.priority === 'Medium' 
          ? '4px solid #f59e0b' 
          : '4px solid #10b981',
        position: 'relative',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        cursor: 'pointer'
      }}
      onClick={() => onViewDetails && onViewDetails(task)}
    >
      <div>
        {/* Top Tag Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
              <Flag size={11} />
              {task.priority}
            </span>

            <span className={`badge ${getStatusBadgeClass(task.status)}`}>
              {task.status}
            </span>

            {task.is_overdue && (
              <span className="badge badge-overdue">
                <AlertTriangle size={11} />
                Overdue
              </span>
            )}

            {task.is_today && (
              <span className="badge badge-today">
                <Clock size={11} />
                Due Today
              </span>
            )}
          </div>

          {/* Quick Actions (Edit / Delete) */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(task)}
              className="btn-icon"
              title="Edit Task"
              style={{ padding: '6px', borderRadius: '6px' }}
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="btn-icon"
              title="Delete Task"
              style={{ padding: '6px', borderRadius: '6px', color: '#ef4444' }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.02rem',
          fontWeight: '700',
          color: isCompleted ? '#64748b' : '#0f172a',
          textDecoration: isCompleted ? 'line-through' : 'none',
          marginBottom: '6px',
          lineHeight: '1.35'
        }}>
          {task.title}
        </h3>

        {/* Description snippet */}
        {task.description && (
          <p style={{
            fontSize: '0.84rem',
            color: '#64748b',
            lineHeight: '1.45',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Info & Mark Complete */}
      <div 
        style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.78rem', color: '#64748b' }}>
          {task.due_date ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              color: task.is_overdue ? '#dc2626' : '#64748b',
              fontWeight: task.is_overdue ? '700' : '500'
            }}>
              <Calendar size={13} />
              <span>Due: {formatDate(task.due_date)}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8' }}>
              <Calendar size={13} />
              <span>No due date</span>
            </div>
          )}
        </div>

        {/* Status switch / Mark complete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isCompleted ? (
            <button
              onClick={() => onMarkComplete(task)}
              className="btn btn-sm btn-success"
              style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '5px' }}
              title="Mark as Complete"
            >
              <CheckCircle2 size={13} />
              <span>Complete</span>
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: '#059669',
              fontWeight: '700'
            }}>
              <CheckCircle2 size={14} />
              <span>Done</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

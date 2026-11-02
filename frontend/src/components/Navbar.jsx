import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, LogOut, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onOpenCreateTask }) {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header style={{
      height: '70px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 36px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Search / Context hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#10b981',
          fontSize: '0.85rem',
          fontWeight: '600',
          backgroundColor: '#ecfdf5',
          padding: '6px 12px',
          borderRadius: '20px'
        }}>
          <CheckCircle2 size={16} />
          <span>Django REST + React Active</span>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <button
          onClick={onOpenCreateTask}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>

        <div style={{
          height: '28px',
          width: '1px',
          backgroundColor: '#e2e8f0'
        }} />

        {/* User Info & Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#e0e7ff',
            color: '#4338ca',
            fontWeight: '700',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            {getInitials(user?.name)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '160px' }}>
            <span style={{
              fontSize: '0.88rem',
              fontWeight: '700',
              color: '#0f172a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.name || 'User'}
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: '#64748b',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.email || ''}
            </span>
          </div>

          <button
            onClick={logout}
            className="btn-icon"
            title="Log Out"
            style={{
              marginLeft: '4px',
              color: '#64748b',
              padding: '8px',
              borderRadius: '8px'
            }}
          >
            <LogOut size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}

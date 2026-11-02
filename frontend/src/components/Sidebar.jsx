import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Kanban, 
  Calendar, 
  ListTodo
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, metrics }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Module 2: Overview & stats'
    },
    {
      id: 'tasks',
      label: 'All Tasks',
      icon: CheckSquare,
      badge: metrics?.total_tasks || 0,
      desc: 'Modules 4 & 7: Search & manage'
    },
    {
      id: 'kanban',
      label: 'Status Board',
      icon: Kanban,
      badge: metrics?.pending_tasks || 0,
      desc: 'Module 5: Workflow stages'
    },
    {
      id: 'calendar',
      label: 'Calendar & Deadlines',
      icon: Calendar,
      badge: metrics?.overdue_tasks > 0 ? `${metrics.overdue_tasks} overdue` : null,
      badgeColor: metrics?.overdue_tasks > 0 ? '#ef4444' : null,
      desc: 'Module 6: Dates & deadlines'
    },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      flexShrink: 0
    }}>
      <div>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px 24px',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(79, 70, 229, 0.25)'
          }}>
            <ListTodo size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
              TaskFlow
            </h2>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
              PostgreSQL + Django DRF
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? '#eef2ff' : 'transparent',
                  color: isActive ? '#4f46e5' : '#475569',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={19} color={isActive ? '#4f46e5' : '#64748b'} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    backgroundColor: item.badgeColor ? '#fef2f2' : isActive ? '#e0e7ff' : '#f1f5f9',
                    color: item.badgeColor ? '#dc2626' : isActive ? '#4338ca' : '#64748b',
                    border: item.badgeColor ? '1px solid #fca5a5' : 'none'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Database & Stack Info Pill */}
      <div style={{
        padding: '14px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '0.78rem'
      }}>
        <div style={{ fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
          Architecture Stack
        </div>
        <div style={{ color: '#64748b', lineHeight: '1.4' }}>
          • React 18 + Axios<br />
          • Django REST Framework<br />
          • PostgreSQL Relational DB
        </div>
      </div>
    </aside>
  );
}

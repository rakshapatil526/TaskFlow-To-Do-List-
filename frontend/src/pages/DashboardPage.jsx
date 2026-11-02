import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListTodo, 
  Plus, 
  TrendingUp, 
  ArrowRight,
  Flame,
  CalendarDays
} from 'lucide-react';
import TaskCard from '../components/TaskCard';

export default function DashboardPage({ 
  metrics, 
  loading, 
  onOpenCreateTask, 
  onSelectTab,
  onEditTask,
  onDeleteTask,
  onMarkComplete,
  onViewDetails
}) {
  if (loading && !metrics) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
        <p>Loading your dashboard metrics...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: metrics?.total_tasks || 0,
      icon: ListTodo,
      color: '#4f46e5',
      bgColor: '#eef2ff',
      borderColor: '#c7d2fe',
      sub: 'All registered tasks'
    },
    {
      title: 'Pending Tasks',
      value: metrics?.pending_tasks || 0,
      icon: Clock,
      color: '#0284c7',
      bgColor: '#f0f9ff',
      borderColor: '#bae6fd',
      sub: `${metrics?.to_do_tasks || 0} To Do • ${metrics?.in_progress_tasks || 0} In Progress`
    },
    {
      title: 'Completed Tasks',
      value: metrics?.completed_tasks || 0,
      icon: CheckCircle2,
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      sub: `${metrics?.completion_rate || 0}% overall completion`
    },
    {
      title: 'Overdue Tasks',
      value: metrics?.overdue_tasks || 0,
      icon: AlertTriangle,
      color: '#dc2626',
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
      sub: metrics?.overdue_tasks > 0 ? 'Requires immediate action' : 'All deadlines on track!'
    },
    {
      title: "Today's Tasks",
      value: metrics?.todays_tasks || 0,
      icon: CalendarDays,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
      sub: 'Scheduled for completion today'
    },
  ];

  return (
    <div className="fade-in">
      {/* Dashboard Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Task Overview Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Real-time analytics and task velocity synchronized with Django REST APIs.
          </p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="btn btn-primary"
          style={{ padding: '11px 20px', borderRadius: '12px' }}
        >
          <Plus size={19} />
          <span>Add New Task</span>
        </button>
      </div>

      {/* 5 Core Metric Cards (Module 2 requirements) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '18px',
        marginBottom: '28px'
      }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                borderTop: `4px solid ${card.color}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {card.title}
                </span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: card.bgColor,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={19} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress & Breakdown Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Completion Velocity Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
              Completion Progress
            </h3>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: '700',
              color: '#059669',
              backgroundColor: '#ecfdf5',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              {metrics?.completion_rate || 0}%
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#e2e8f0',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{
              width: `${metrics?.completion_rate || 0}%`,
              height: '100%',
              backgroundColor: '#10b981',
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#64748b' }}>
            <span><strong>{metrics?.completed_tasks || 0}</strong> completed</span>
            <span><strong>{metrics?.pending_tasks || 0}</strong> in progress / to do</span>
          </div>
        </div>

        {/* Priority Breakdown Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
              Priority Distribution
            </h3>
            <Flame size={18} color="#ef4444" />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, backgroundColor: '#fef2f2', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #fee2e2' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#dc2626' }}>
                {metrics?.priority_breakdown?.high || 0}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#991b1b' }}>High Priority</div>
            </div>

            <div style={{ flex: 1, backgroundColor: '#fffbeb', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #fef3c7' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#d97706' }}>
                {metrics?.priority_breakdown?.medium || 0}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#92400e' }}>Medium Priority</div>
            </div>

            <div style={{ flex: 1, backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #d1fae5' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669' }}>
                {metrics?.priority_breakdown?.low || 0}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#065f46' }}>Low Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Task Lists */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Recent Tasks */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
              Recent Tasks
            </h2>
            <button
              onClick={() => onSelectTab('tasks')}
              className="btn-icon"
              style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: '600', gap: '4px' }}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {metrics?.recent_tasks?.length > 0 ? (
              metrics.recent_tasks.map((task) => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onMarkComplete={onMarkComplete}
                  onViewDetails={onViewDetails}
                />
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                <p>No tasks created yet. Click "+ Add New Task" to begin!</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
              Upcoming Deadlines
            </h2>
            <button
              onClick={() => onSelectTab('calendar')}
              className="btn-icon"
              style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: '600', gap: '4px' }}
            >
              <span>Open Calendar</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {metrics?.upcoming_tasks?.length > 0 ? (
              metrics.upcoming_tasks.map((task) => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onMarkComplete={onMarkComplete}
                  onViewDetails={onViewDetails}
                />
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                <p>No upcoming task deadlines scheduled.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

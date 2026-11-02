import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import TaskCard from '../components/TaskCard';
import { 
  CheckCircle2, 
  Clock, 
  CircleDot, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function KanbanPage({
  onOpenCreateTask,
  onEditTask,
  onDeleteTask,
  onMarkComplete,
  onViewDetails,
  refreshTrigger
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const handleUpdateStatus = async (task, newStatus) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t.task_id === task.task_id ? { ...t, status: newStatus } : t));
      await apiClient.patch(`/tasks/${task.task_id}/update_status/`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      fetchTasks();
    }
  };

  const columns = [
    {
      id: 'To Do',
      title: 'To Do',
      icon: CircleDot,
      color: '#475569',
      bgColor: '#f8fafc',
      headerBg: '#f1f5f9',
      borderColor: '#cbd5e1',
      tasks: tasks.filter(t => t.status === 'To Do'),
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      icon: Clock,
      color: '#2563eb',
      bgColor: '#f8faff',
      headerBg: '#eff6ff',
      borderColor: '#bfdbfe',
      tasks: tasks.filter(t => t.status === 'In Progress'),
    },
    {
      id: 'Completed',
      title: 'Completed',
      icon: CheckCircle2,
      color: '#059669',
      bgColor: '#f6fdf9',
      headerBg: '#ecfdf5',
      borderColor: '#a7f3d0',
      tasks: tasks.filter(t => t.status === 'Completed'),
    },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
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
            Status Board
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Manage task lifecycle across To Do, In Progress, and Completed stages.
          </p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="btn btn-primary"
          style={{ padding: '11px 20px', borderRadius: '12px' }}
        >
          <Plus size={19} />
          <span>Add Task</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <p>Syncing status board with Django backend...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {columns.map((col) => {
            const Icon = col.icon;
            return (
              <div 
                key={col.id}
                style={{
                  backgroundColor: col.bgColor,
                  borderRadius: '16px',
                  border: `1px solid ${col.borderColor}`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '520px'
                }}
              >
                {/* Column Header */}
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: col.headerBg,
                  borderBottom: `1px solid ${col.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} color={col.color} />
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                      {col.title}
                    </h2>
                  </div>

                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    backgroundColor: '#ffffff',
                    color: col.color,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                  }}>
                    {col.tasks.length}
                  </span>
                </div>

                {/* Column Content */}
                <div style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  flex: 1
                }}>
                  {col.tasks.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 16px',
                      color: '#94a3b8',
                      fontSize: '0.88rem'
                    }}>
                      No tasks in {col.title}
                    </div>
                  ) : (
                    col.tasks.map((task) => (
                      <div key={task.task_id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <TaskCard
                          task={task}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}
                          onMarkComplete={onMarkComplete}
                          onViewDetails={onViewDetails}
                        />

                        {/* Quick Status Shift Controls */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '6px',
                          padding: '0 4px'
                        }}>
                          {col.id !== 'To Do' && (
                            <button
                              onClick={() => handleUpdateStatus(task, col.id === 'Completed' ? 'In Progress' : 'To Do')}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.72rem', padding: '3px 8px', gap: '4px' }}
                              title="Move back"
                            >
                              <ArrowLeft size={12} />
                              <span>{col.id === 'Completed' ? 'To In Progress' : 'To Do'}</span>
                            </button>
                          )}

                          {col.id !== 'Completed' && (
                            <button
                              onClick={() => handleUpdateStatus(task, col.id === 'To Do' ? 'In Progress' : 'Completed')}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.72rem', padding: '3px 8px', gap: '4px' }}
                              title="Move forward"
                            >
                              <span>{col.id === 'To Do' ? 'To In Progress' : 'Mark Completed'}</span>
                              <ArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

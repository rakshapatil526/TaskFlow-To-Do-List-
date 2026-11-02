import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import TaskCard from '../components/TaskCard';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Plus
} from 'lucide-react';

export default function CalendarPage({
  onOpenCreateTask,
  onEditTask,
  onDeleteTask,
  onMarkComplete,
  onViewDetails,
  refreshTrigger
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  // Group tasks by due date
  const tasksByDueDate = {};
  tasks.forEach((task) => {
    if (task.due_date) {
      if (!tasksByDueDate[task.due_date]) {
        tasksByDueDate[task.due_date] = [];
      }
      tasksByDueDate[task.due_date].push(task);
    }
  });

  // Selected date tasks
  const selectedDateTasks = tasksByDueDate[selectedDateStr] || [];

  // Overdue tasks list
  const overdueTasks = tasks.filter(t => t.is_overdue);

  // Upcoming deadlines (due within next 7 days and not completed)
  const upcomingTasks = tasks.filter(t => {
    if (!t.due_date || t.status === 'Completed' || t.is_overdue) return false;
    return t.due_date >= todayStr;
  }).sort((a, b) => a.due_date.localeCompare(b.due_date));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fade-in">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Calendar & Deadlines
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Interactive timeline tracking upcoming dates and overdue deliverables.
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

      {/* Main Grid: Calendar on Left, Side Panel on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Calendar View Card */}
        <div className="card" style={{ padding: '24px' }}>
          {/* Calendar Header Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>
              {monthNames[month]} {year}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleToday}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: '600' }}
              >
                Today
              </button>

              <button
                onClick={handlePrevMonth}
                className="btn-icon"
                style={{ padding: '6px', borderRadius: '8px' }}
                title="Previous Month"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNextMonth}
                className="btn-icon"
                style={{ padding: '6px', borderRadius: '8px' }}
                title="Next Month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontWeight: '700',
            fontSize: '0.8rem',
            color: '#64748b',
            marginBottom: '10px'
          }}>
            {weekDays.map((d) => (
              <div key={d} style={{ padding: '8px 0' }}>{d}</div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px'
          }}>
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} style={{ minHeight: '80px', opacity: 0.2 }} />
            ))}

            {/* Days in month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
              const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
              const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

              const dayTasks = tasksByDueDate[dateStr] || [];
              const isSelected = selectedDateStr === dateStr;
              const isToday = todayStr === dateStr;
              const hasOverdue = dayTasks.some(t => t.is_overdue);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  style={{
                    minHeight: '88px',
                    padding: '8px',
                    borderRadius: '12px',
                    border: isSelected 
                      ? '2px solid #4f46e5' 
                      : isToday 
                      ? '2px solid #a5b4fc' 
                      : '1px solid #e2e8f0',
                    backgroundColor: isSelected 
                      ? '#f5f3ff' 
                      : isToday 
                      ? '#faf5ff' 
                      : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    fontWeight: isToday || isSelected ? '800' : '600',
                    color: isToday ? '#4f46e5' : '#1e293b'
                  }}>
                    <span>{dayNum}</span>
                    {dayTasks.length > 0 && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: hasOverdue ? '#dc2626' : '#4f46e5',
                        backgroundColor: hasOverdue ? '#fee2e2' : '#e0e7ff',
                        padding: '1px 6px',
                        borderRadius: '999px'
                      }}>
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Indicators */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.task_id}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: '600',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          backgroundColor: t.status === 'Completed'
                            ? '#d1fae5'
                            : t.is_overdue
                            ? '#fee2e2'
                            : '#e0e7ff',
                          color: t.status === 'Completed'
                            ? '#065f46'
                            : t.is_overdue
                            ? '#991b1b'
                            : '#3730a3'
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600' }}>
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Panel: Selected Date Details & Overdue Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Overdue Alert Box */}
          {overdueTasks.length > 0 && (
            <div style={{
              backgroundColor: '#fef2f2',
              borderRadius: '16px',
              border: '1px solid #fecaca',
              padding: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', marginBottom: '10px' }}>
                <AlertTriangle size={18} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800' }}>
                  {overdueTasks.length} Overdue {overdueTasks.length === 1 ? 'Task' : 'Tasks'}
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#991b1b', marginBottom: '12px' }}>
                Past due tasks requiring immediate review or status completion.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {overdueTasks.slice(0, 3).map((t) => (
                  <div 
                    key={t.task_id}
                    onClick={() => onViewDetails(t)}
                    style={{
                      backgroundColor: '#ffffff',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #fee2e2',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>
                      {t.title}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: '700' }}>
                      {t.due_date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Date Tasks Pane */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                  Tasks for Date
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {selectedDateStr}
                </span>
              </div>

              <span style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                padding: '3px 10px',
                borderRadius: '999px'
              }}>
                {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedDateTasks.length > 0 ? (
                selectedDateTasks.map((task) => (
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
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: '0.86rem' }}>
                  No tasks due on {selectedDateStr}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

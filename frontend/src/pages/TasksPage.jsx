import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import TaskCard from '../components/TaskCard';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Plus, 
  AlertTriangle, 
  ListFilter,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export default function TasksPage({
  onOpenCreateTask,
  onEditTask,
  onDeleteTask,
  onMarkComplete,
  onViewDetails,
  refreshTrigger
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Module 7 Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('-created_date');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (priorityFilter) params.priority = priorityFilter;
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date_filter = dateFilter;
      if (sortBy) params.ordering = sortBy;

      const res = await apiClient.get('/tasks/', { params });
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks from server.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, priorityFilter, statusFilter, dateFilter, sortBy]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTasks();
    }, 200);
    return () => clearTimeout(debounceTimer);
  }, [fetchTasks, refreshTrigger]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('');
    setStatusFilter('');
    setDateFilter('');
    setSortBy('-created_date');
  };

  const hasActiveFilters = Boolean(searchQuery || priorityFilter || statusFilter || dateFilter);

  return (
    <div className="fade-in">
      {/* Top Header */}
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
            Tasks Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Manage, edit, filter and track all your tasks.
          </p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="btn btn-primary"
          style={{ padding: '11px 20px', borderRadius: '12px' }}
        >
          <Plus size={19} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Module 7: Search & Filter Toolbar */}
      <div className="card" style={{ padding: '18px 22px', marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          alignItems: 'center'
        }}>
          {/* Search by Task Title */}
          <div className="input-with-icon" style={{ gridColumn: 'span 2' }}>
            <Search size={18} className="input-icon-left" />
            <input
              type="text"
              placeholder="Search by task title or description..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter by Priority */}
          <div>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Priority: All</option>
              <option value="High">Priority: High</option>
              <option value="Medium">Priority: Medium</option>
              <option value="Low">Priority: Low</option>
            </select>
          </div>

          {/* Filter by Status */}
          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status: All</option>
              <option value="To Do">Status: To Do</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Completed">Status: Completed</option>
            </select>
          </div>

          {/* Filter by Due Date */}
          <div>
            <select
              className="form-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">Due Date: All</option>
              <option value="today">Due Today</option>
              <option value="this_week">Due This Week</option>
              <option value="overdue">Overdue Deadlines</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="-created_date">Sort: Newest First</option>
              <option value="created_date">Sort: Oldest First</option>
              <option value="due_date">Sort: Due Date (Earliest)</option>
              <option value="-due_date">Sort: Due Date (Latest)</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters & Count Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          fontSize: '0.84rem'
        }}>
          <div style={{ color: '#64748b' }}>
            Showing <strong>{tasks.length}</strong> matching {tasks.length === 1 ? 'task' : 'tasks'}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              <RotateCcw size={14} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Task List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <p>Filtering tasks from PostgreSQL database...</p>
        </div>
      ) : error ? (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #fecaca',
          textAlign: 'center'
        }}>
          {error}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card empty-state">
          <Layers className="empty-state-icon" />
          <h3 className="empty-state-title">No tasks found</h3>
          <p className="empty-state-subtitle">
            {hasActiveFilters
              ? 'No tasks match the selected search and filter criteria. Try clearing some filters.'
              : 'You have not added any tasks yet. Click the button below to create your first task!'}
          </p>
          {hasActiveFilters ? (
            <button onClick={handleClearFilters} className="btn btn-secondary">
              <RotateCcw size={16} />
              <span>Reset Filters</span>
            </button>
          ) : (
            <button onClick={onOpenCreateTask} className="btn btn-primary">
              <Plus size={18} />
              <span>Create Task</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
          gap: '20px'
        }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.task_id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMarkComplete={onMarkComplete}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

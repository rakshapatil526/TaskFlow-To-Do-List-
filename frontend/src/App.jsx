import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import apiClient from './api/client';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import KanbanPage from './pages/KanbanPage';
import CalendarPage from './pages/CalendarPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TaskModal from './components/TaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [detailModalTask, setDetailModalTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [deleteModalTask, setDeleteModalTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Dashboard metrics
  const fetchDashboardMetrics = useCallback(async () => {
    if (!user) return;
    setMetricsLoading(true);
    try {
      const res = await apiClient.get('/tasks/dashboard/');
      setMetrics(res.data);
    } catch (err) {
      console.error('Error fetching dashboard metrics', err);
    } finally {
      setMetricsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardMetrics();
    }
  }, [user, fetchDashboardMetrics, refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handlers for Task CRUD
  const handleOpenCreateTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (taskToEdit) {
      await apiClient.put(`/tasks/${taskToEdit.task_id}/`, taskData);
    } else {
      await apiClient.post('/tasks/', taskData);
    }
    triggerRefresh();
  };

  const handleOpenDelete = (task) => {
    setDeleteModalTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (task) => {
    setDeleteLoading(true);
    try {
      await apiClient.delete(`/tasks/${task.task_id}/`);
      setIsDeleteModalOpen(false);
      setDeleteModalTask(null);
      if (detailModalTask?.task_id === task.task_id) {
        setIsDetailModalOpen(false);
      }
      triggerRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleMarkComplete = async (task) => {
    try {
      await apiClient.patch(`/tasks/${task.task_id}/mark_complete/`);
      triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (task) => {
    setDetailModalTask(task);
    setIsDetailModalOpen(true);
  };

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        color: '#64748b'
      }}>
        <p>Loading application...</p>
      </div>
    );
  }

  // Module 1: Auth screen if not logged in
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        metrics={metrics}
      />

      {/* Main Body */}
      <div className="main-content">
        <Navbar onOpenCreateTask={handleOpenCreateTask} />

        <main className="page-body">
          {activeTab === 'dashboard' && (
            <DashboardPage
              metrics={metrics}
              loading={metricsLoading}
              onOpenCreateTask={handleOpenCreateTask}
              onSelectTab={setActiveTab}
              onEditTask={handleOpenEditTask}
              onDeleteTask={handleOpenDelete}
              onMarkComplete={handleMarkComplete}
              onViewDetails={handleViewDetails}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksPage
              onOpenCreateTask={handleOpenCreateTask}
              onEditTask={handleOpenEditTask}
              onDeleteTask={handleOpenDelete}
              onMarkComplete={handleMarkComplete}
              onViewDetails={handleViewDetails}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanPage
              onOpenCreateTask={handleOpenCreateTask}
              onEditTask={handleOpenEditTask}
              onDeleteTask={handleOpenDelete}
              onMarkComplete={handleMarkComplete}
              onViewDetails={handleViewDetails}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarPage
              onOpenCreateTask={handleOpenCreateTask}
              onEditTask={handleOpenEditTask}
              onDeleteTask={handleOpenDelete}
              onMarkComplete={handleMarkComplete}
              onViewDetails={handleViewDetails}
              refreshTrigger={refreshTrigger}
            />
          )}
        </main>
      </div>

      {/* Module 3 & 4: Create & Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Module 4: Task Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        task={detailModalTask}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleOpenEditTask}
        onDelete={handleOpenDelete}
        onMarkComplete={handleMarkComplete}
      />

      {/* Module 4: Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={deleteModalTask}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

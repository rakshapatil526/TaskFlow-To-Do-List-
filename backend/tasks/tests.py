from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from .models import User, Task


class TaskflowApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.today = timezone.localdate()

        # Create user 1
        self.user1_data = {
            'name': 'Alice Johnson',
            'email': 'alice@example.com',
            'password': 'password123'
        }
        self.user1 = User.objects.create_user(**self.user1_data)

        # Create user 2 for isolation testing
        self.user2_data = {
            'name': 'Bob Smith',
            'email': 'bob@example.com',
            'password': 'password456'
        }
        self.user2 = User.objects.create_user(**self.user2_data)

    def test_module_1_register_user(self):
        """Module 1: Test account creation with name, email, password."""
        response = self.client.post('/api/auth/register/', {
            'name': 'Charlie Brown',
            'email': 'charlie@example.com',
            'password': 'secretpassword'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['name'], 'Charlie Brown')
        self.assertEqual(response.data['user']['email'], 'charlie@example.com')

    def test_module_1_login_user(self):
        """Module 1: Test login with email and password."""
        response = self.client.post('/api/auth/login/', {
            'email': 'alice@example.com',
            'password': 'password123'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], 'alice@example.com')

    def test_module_3_create_task(self):
        """Module 3: Test task creation with title, description, start_date, due_date, priority."""
        self.client.force_authenticate(user=self.user1)
        response = self.client.post('/api/tasks/', {
            'title': 'Design Homepage wireframes',
            'description': 'Create Figma wireframes for the landing page',
            'start_date': str(self.today),
            'due_date': str(self.today + timedelta(days=2)),
            'priority': 'High',
            'status': 'To Do'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Design Homepage wireframes')
        self.assertEqual(response.data['priority'], 'High')
        self.assertEqual(response.data['status'], 'To Do')
        self.assertEqual(response.data['user_id'], self.user1.id)

    def test_user_data_isolation(self):
        """Ensure users can only view their own tasks."""
        Task.objects.create(
            user=self.user1,
            title='Alice Task',
            priority='Medium',
            status='To Do'
        )
        Task.objects.create(
            user=self.user2,
            title='Bob Secret Task',
            priority='High',
            status='In Progress'
        )

        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [t['title'] for t in response.data]
        self.assertIn('Alice Task', titles)
        self.assertNotIn('Bob Secret Task', titles)

    def test_module_4_view_manage_tasks(self):
        """Module 4: Edit, retrieve, and delete task."""
        task = Task.objects.create(
            user=self.user1,
            title='Old Title',
            description='Old Description',
            priority='Low',
            status='To Do'
        )

        self.client.force_authenticate(user=self.user1)

        # Retrieve
        res_get = self.client.get(f'/api/tasks/{task.task_id}/')
        self.assertEqual(res_get.status_code, status.HTTP_200_OK)
        self.assertEqual(res_get.data['title'], 'Old Title')

        # Edit
        res_patch = self.client.patch(f'/api/tasks/{task.task_id}/', {
            'title': 'Updated Title',
            'priority': 'High'
        }, format='json')
        self.assertEqual(res_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(res_patch.data['title'], 'Updated Title')
        self.assertEqual(res_patch.data['priority'], 'High')

        # Delete
        res_del = self.client.delete(f'/api/tasks/{task.task_id}/')
        self.assertEqual(res_del.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(task_id=task.task_id).exists())

    def test_module_5_status_management(self):
        """Module 5: Test status update and mark complete."""
        task = Task.objects.create(
            user=self.user1,
            title='Feature Development',
            priority='Medium',
            status='To Do'
        )

        self.client.force_authenticate(user=self.user1)

        # Update status to In Progress
        res_status = self.client.patch(f'/api/tasks/{task.task_id}/update_status/', {
            'status': 'In Progress'
        }, format='json')
        self.assertEqual(res_status.status_code, status.HTTP_200_OK)
        self.assertEqual(res_status.data['status'], 'In Progress')

        # Mark as Complete
        res_complete = self.client.patch(f'/api/tasks/{task.task_id}/mark_complete/')
        self.assertEqual(res_complete.status_code, status.HTTP_200_OK)
        self.assertEqual(res_complete.data['status'], 'Completed')

    def test_module_2_dashboard_metrics(self):
        """Module 2: Test dashboard calculations (total, pending, completed, overdue, today)."""
        # Overdue task
        Task.objects.create(
            user=self.user1,
            title='Overdue Task',
            priority='High',
            status='To Do',
            due_date=self.today - timedelta(days=3)
        )
        # Today's task
        Task.objects.create(
            user=self.user1,
            title='Today Task',
            priority='Medium',
            status='In Progress',
            due_date=self.today
        )
        # Completed task
        Task.objects.create(
            user=self.user1,
            title='Done Task',
            priority='Low',
            status='Completed',
            due_date=self.today - timedelta(days=1)
        )

        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/api/tasks/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data

        self.assertEqual(data['total_tasks'], 3)
        self.assertEqual(data['pending_tasks'], 2)  # 1 To Do + 1 In Progress
        self.assertEqual(data['completed_tasks'], 1)
        self.assertEqual(data['overdue_tasks'], 1)
        self.assertEqual(data['todays_tasks'], 1)

    def test_module_7_search_and_filter(self):
        """Module 7: Test search, priority, status, and date filter."""
        Task.objects.create(
            user=self.user1,
            title='Write Unit Tests',
            description='Test all DRF views',
            priority='High',
            status='To Do',
            due_date=self.today
        )
        Task.objects.create(
            user=self.user1,
            title='Clean Codebase',
            description='Refactor models',
            priority='Low',
            status='Completed',
            due_date=self.today + timedelta(days=5)
        )

        self.client.force_authenticate(user=self.user1)

        # Search
        res_search = self.client.get('/api/tasks/?search=Tests')
        self.assertEqual(len(res_search.data), 1)
        self.assertEqual(res_search.data[0]['title'], 'Write Unit Tests')

        # Filter by priority
        res_prio = self.client.get('/api/tasks/?priority=High')
        self.assertEqual(len(res_prio.data), 1)

        # Filter by status
        res_stat = self.client.get('/api/tasks/?status=Completed')
        self.assertEqual(len(res_stat.data), 1)

        # Filter by today
        res_today = self.client.get('/api/tasks/?date_filter=today')
        self.assertEqual(len(res_today.data), 1)

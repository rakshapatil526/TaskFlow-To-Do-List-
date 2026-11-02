from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q, Count

from .models import User, Task
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    TaskSerializer
)


class RegisterView(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Account created successfully!',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserLoginSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Logged in successfully!',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
    except Exception:
        pass
    return Response({'message': 'Logged out successfully!'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'task_id'

    def get_queryset(self):
        """
        Filter tasks for the authenticated user and apply search & filter query params (Module 7).
        """
        user = self.request.user
        queryset = Task.objects.filter(user=user)
        today = timezone.localdate()

        # Search by task title or description
        search_query = self.request.query_params.get('search', '').strip()
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | Q(description__icontains=search_query)
            )

        # Filter by priority
        priority = self.request.query_params.get('priority', '').strip()
        if priority and priority in ['Low', 'Medium', 'High']:
            queryset = queryset.filter(priority=priority)

        # Filter by status
        task_status = self.request.query_params.get('status', '').strip()
        if task_status and task_status in ['To Do', 'In Progress', 'Completed']:
            queryset = queryset.filter(status=task_status)

        # Filter by due date
        date_filter = self.request.query_params.get('date_filter', '').strip()
        if date_filter == 'today':
            queryset = queryset.filter(due_date=today)
        elif date_filter == 'this_week':
            end_of_week = today + timedelta(days=7)
            queryset = queryset.filter(due_date__gte=today, due_date__lte=end_of_week)
        elif date_filter == 'overdue':
            queryset = queryset.filter(due_date__lt=today).exclude(status='Completed')
        elif date_filter == 'upcoming':
            queryset = queryset.filter(due_date__gte=today).exclude(status='Completed')
        elif self.request.query_params.get('due_date'):
            exact_date = self.request.query_params.get('due_date')
            queryset = queryset.filter(due_date=exact_date)

        # Filter by month for calendar (e.g. month=2026-11)
        month_param = self.request.query_params.get('month', '').strip()
        if month_param and '-' in month_param:
            try:
                year, month = map(int, month_param.split('-')[:2])
                queryset = queryset.filter(
                    Q(due_date__year=year, due_date__month=month) |
                    Q(start_date__year=year, start_date__month=month)
                )
            except ValueError:
                pass

        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_date')
        valid_orderings = ['created_date', '-created_date', 'due_date', '-due_date', 'priority', '-priority', 'title', '-title']
        if ordering in valid_orderings:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_date')

        return queryset

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        Module 2: Dashboard metrics
        - Total tasks
        - Pending tasks (To Do + In Progress)
        - Completed tasks
        - Overdue tasks
        - Today's tasks
        """
        user = request.user
        tasks = Task.objects.filter(user=user)
        today = timezone.localdate()

        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='Completed').count()
        to_do_tasks = tasks.filter(status='To Do').count()
        in_progress_tasks = tasks.filter(status='In Progress').count()
        pending_tasks = to_do_tasks + in_progress_tasks

        overdue_tasks = tasks.filter(due_date__lt=today).exclude(status='Completed').count()
        todays_tasks = tasks.filter(due_date=today).count()

        # Priority breakdown
        low_priority = tasks.filter(priority='Low').count()
        medium_priority = tasks.filter(priority='Medium').count()
        high_priority = tasks.filter(priority='High').count()

        # Completion rate
        completion_rate = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0

        # Recent tasks (latest 5)
        recent_tasks = TaskSerializer(tasks.order_by('-created_date')[:5], many=True).data

        # Upcoming tasks (next 5 due)
        upcoming_tasks = TaskSerializer(
            tasks.filter(due_date__gte=today).exclude(status='Completed').order_by('due_date')[:5],
            many=True
        ).data

        # Overdue task items (top 5)
        overdue_items = TaskSerializer(
            tasks.filter(due_date__lt=today).exclude(status='Completed').order_by('due_date')[:5],
            many=True
        ).data

        return Response({
            'total_tasks': total_tasks,
            'pending_tasks': pending_tasks,
            'completed_tasks': completed_tasks,
            'to_do_tasks': to_do_tasks,
            'in_progress_tasks': in_progress_tasks,
            'overdue_tasks': overdue_tasks,
            'todays_tasks': todays_tasks,
            'completion_rate': completion_rate,
            'priority_breakdown': {
                'low': low_priority,
                'medium': medium_priority,
                'high': high_priority,
            },
            'recent_tasks': recent_tasks,
            'upcoming_tasks': upcoming_tasks,
            'overdue_items': overdue_items,
        })

    @action(detail=True, methods=['patch'])
    def update_status(self, request, task_id=None):
        """
        Module 5: Task Status Management
        Quick status update ('To Do', 'In Progress', 'Completed') or Mark as Complete.
        """
        task = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return Response({'error': 'status field is required'}, status=status.HTTP_400_BAD_REQUEST)

        valid_statuses = [c[0] for c in Task.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({
                'error': f'Invalid status. Allowed values: {valid_statuses}'
            }, status=status.HTTP_400_BAD_REQUEST)

        task.status = new_status
        task.save()
        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def mark_complete(self, request, task_id=None):
        """
        Module 5: One-click mark as complete.
        """
        task = self.get_object()
        task.status = 'Completed'
        task.save()
        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)

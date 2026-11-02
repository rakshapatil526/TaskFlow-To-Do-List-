from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from tasks.models import User, Task


class Command(BaseCommand):
    help = 'Seeds the database with sample demo users and tasks across all statuses and priorities'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial demo data...')

        user, created = User.objects.get_or_create(
            email='demo@example.com',
            defaults={
                'name': 'Alex Morgan',
            }
        )
        if created or not user.check_password('password123'):
            user.set_password('password123')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created demo user: demo@example.com / password123'))
        else:
            self.stdout.write('Demo user already exists.')

        today = timezone.localdate()

        demo_tasks = [
            {
                'title': 'Design high-fidelity user dashboard mockup',
                'description': 'Create Figma wireframes and design system components for the Taskboard dashboard.',
                'priority': 'High',
                'status': 'In Progress',
                'start_date': today - timedelta(days=2),
                'due_date': today + timedelta(days=2),
            },
            {
                'title': 'Integrate PostgreSQL database with Django ORM',
                'description': 'Configure database connection settings, write migrations, and establish model relationships.',
                'priority': 'High',
                'status': 'Completed',
                'start_date': today - timedelta(days=5),
                'due_date': today - timedelta(days=1),
            },
            {
                'title': 'Submit weekly sprint progress report',
                'description': 'Compile task velocity, completed items, and open blockers for team standup review.',
                'priority': 'Medium',
                'status': 'To Do',
                'start_date': today - timedelta(days=4),
                'due_date': today - timedelta(days=1),  # Overdue
            },
            {
                'title': 'Code review authentication & JWT refresh endpoints',
                'description': 'Audit registration, login, token refresh, and password security policies.',
                'priority': 'High',
                'status': 'To Do',
                'start_date': today,
                'due_date': today,  # Today
            },
            {
                'title': 'Set up responsive layout for calendar module',
                'description': 'Ensure monthly grid, overdue badge indicators, and day selection look crisp on mobile and desktop.',
                'priority': 'Medium',
                'status': 'In Progress',
                'start_date': today,
                'due_date': today + timedelta(days=4),
            },
            {
                'title': 'Write comprehensive unit and API integration tests',
                'description': 'Cover edge cases for task search, multi-field filters, and permission isolation.',
                'priority': 'Medium',
                'status': 'Completed',
                'start_date': today - timedelta(days=3),
                'due_date': today,
            },
            {
                'title': 'Update project documentation and API specifications',
                'description': 'Provide instructions for local setup, environment variables, and REST endpoints.',
                'priority': 'Low',
                'status': 'To Do',
                'start_date': today + timedelta(days=1),
                'due_date': today + timedelta(days=7),
            },
        ]

        count = 0
        for task_info in demo_tasks:
            t, was_created = Task.objects.get_or_create(
                user=user,
                title=task_info['title'],
                defaults=task_info
            )
            if was_created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} new demo tasks for {user.email}!'))

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Task


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['user_id', 'name', 'email', 'password']
        read_only_fields = ['user_id']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email', '').lower()
        password = data.get('password', '')

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        user = authenticate(username=email, password=password)
        if not user:
            # Check if user exists to provide helpful error
            if not User.objects.filter(email=email).exists():
                raise serializers.ValidationError("No account found with this email.")
            raise serializers.ValidationError("Incorrect password.")

        if not user.is_active:
            raise serializers.ValidationError("This user account is inactive.")

        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'email']


class TaskSerializer(serializers.ModelSerializer):
    is_overdue = serializers.BooleanField(read_only=True)
    is_today = serializers.BooleanField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Task
        fields = [
            'task_id',
            'user_id',
            'title',
            'description',
            'priority',
            'status',
            'start_date',
            'due_date',
            'created_date',
            'updated_date',
            'is_overdue',
            'is_today',
        ]
        read_only_fields = ['task_id', 'user_id', 'created_date', 'updated_date', 'is_overdue', 'is_today']

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Task title cannot be empty.")
        return value.strip()

    def validate(self, data):
        start_date = data.get('start_date')
        due_date = data.get('due_date')
        if start_date and due_date and due_date < start_date:
            raise serializers.ValidationError({
                "due_date": "Due date cannot be before start date."
            })
        return data

    def create(self, validated_data):
        # Automatically associate task with authenticated user
        user = self.context['request'].user
        return Task.objects.create(user=user, **validated_data)

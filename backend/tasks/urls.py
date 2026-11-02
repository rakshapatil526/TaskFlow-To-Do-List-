from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    logout_view,
    user_profile_view,
    TaskViewSet
)

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    # Auth endpoints (Module 1)
    path('auth/register/', RegisterView.as_view({'post': 'create'}), name='register'),
    path('auth/login/', LoginView.as_view({'post': 'create'}), name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/profile/', user_profile_view, name='profile'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Task endpoints (Modules 2, 3, 4, 5, 6, 7)
    path('', include(router.urls)),
]

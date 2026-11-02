from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, JsonResponse


def home_view(request):
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow — Backend API Server</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .card {
            background: #ffffff;
            border-radius: 20px;
            padding: 40px;
            max-width: 680px;
            width: 100%;
            box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
            border: 1px solid #e2e8f0;
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ecfdf5;
            color: #059669;
            border: 1px solid #a7f3d0;
            padding: 5px 12px;
            border-radius: 999px;
            font-size: 0.82rem;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            display: inline-block;
        }
        h1 {
            font-size: 1.85rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        p {
            color: #64748b;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .notice-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 14px 18px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 0.88rem;
            color: #1e40af;
        }
        .endpoints-title {
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
            margin-bottom: 12px;
        }
        .endpoint-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 28px;
        }
        .endpoint-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 14px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            font-size: 0.88rem;
        }
        .endpoint-link {
            color: #4f46e5;
            text-decoration: none;
            font-weight: 700;
            font-family: monospace;
            font-size: 0.92rem;
        }
        .endpoint-link:hover {
            text-decoration: underline;
        }
        .endpoint-desc {
            color: #64748b;
            font-size: 0.82rem;
        }
        .actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 11px 20px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 0.9rem;
            text-decoration: none;
            transition: all 0.15s ease;
        }
        .btn-primary {
            background: #4f46e5;
            color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.25);
        }
        .btn-primary:hover {
            background: #4338ca;
        }
        .btn-secondary {
            background: #f1f5f9;
            color: #334155;
            border: 1px solid #cbd5e1;
        }
        .btn-secondary:hover {
            background: #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="status-badge">
            <span class="status-dot"></span>
            Django REST Backend Active
        </div>
        <h1>TaskFlow API Server</h1>
        <p>The Django backend is running properly. API endpoints are configured and ready to communicate with the React frontend.</p>

        <div class="notice-box">
            💡 <strong>Looking for the User Interface?</strong> The React UI runs separately on port <strong>3000</strong>. You can open it using the button below.
        </div>

        <div class="endpoints-title">Core Backend Endpoints</div>
        <ul class="endpoint-list">
            <li class="endpoint-item">
                <a class="endpoint-link" href="/api/tasks/">/api/tasks/</a>
                <span class="endpoint-desc">Tasks CRUD & Search/Filter</span>
            </li>
            <li class="endpoint-item">
                <a class="endpoint-link" href="/api/tasks/dashboard/">/api/tasks/dashboard/</a>
                <span class="endpoint-desc">Dashboard Statistics API</span>
            </li>
            <li class="endpoint-item">
                <a class="endpoint-link" href="/api/auth/login/">/api/auth/login/</a>
                <span class="endpoint-desc">JWT User Login</span>
            </li>
            <li class="endpoint-item">
                <a class="endpoint-link" href="/api/auth/register/">/api/auth/register/</a>
                <span class="endpoint-desc">User Registration</span>
            </li>
            <li class="endpoint-item">
                <a class="endpoint-link" href="/admin/">/admin/</a>
                <span class="endpoint-desc">Django Administration</span>
            </li>
        </ul>

        <div class="actions">
            <a href="http://localhost:3000" class="btn btn-primary" target="_blank">Open React UI (Port 3000)</a>
            <a href="/api/tasks/dashboard/" class="btn btn-secondary">Test Dashboard API</a>
        </div>
    </div>
</body>
</html>
"""
    return HttpResponse(html_content)


def custom_404_view(request, exception=None):
    return JsonResponse({
        'status': 404,
        'error': 'Not Found',
        'message': f"The requested URL '{request.path}' was not found on this Django server.",
        'available_endpoints': [
            '/',
            '/api/tasks/',
            '/api/tasks/dashboard/',
            '/api/auth/login/',
            '/api/auth/register/',
            '/admin/',
        ],
        'note': 'The React web frontend runs on http://localhost:3000'
    }, status=404)


urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),
]

handler404 = 'taskflow_backend.urls.custom_404_view'

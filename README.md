# TaskFlow — Modern Full-Stack Task & Project Management System

TaskFlow is a production-grade full-stack task management web application designed and built strictly according to modern software architecture specifications. It features a responsive React frontend powered by Axios, a Python Django REST Framework backend, and PostgreSQL relational database persistence.

---

## 🛠️ Languages and Technologies

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (v18), HTML5, CSS3, JavaScript (ES6+), Vite |
| **Backend** | Python 3.13, Django 5.1, Django REST Framework (DRF), SimpleJWT |
| **Database** | PostgreSQL (with seamless local dev fallback to SQLite) |
| **API Integration** | Axios (with JWT interceptors, auto token attachment, and refresh handling) |
| **Icons & Design** | Lucide React, Modern SaaS Design System |

---

## 💻 7 UI Modules

### Module 1: Register & Login
* **Features:**
  * User account creation (Full Name, Email, Password).
  * JWT Token Authentication (`/api/auth/register/` and `/api/auth/login/`).
  * Show/Hide password toggle on auth forms.
  * Logout with token clearing.
  * Demo quick-fill button (`demo@example.com` / `password123`).
* **How it works:** Django authenticates users and enforces strict user-level data isolation so users can only ever access and manipulate their own tasks.

### Module 2: Dashboard
* **Features:**
  * **Total tasks** counter.
  * **Pending tasks** counter (To Do + In Progress).
  * **Completed tasks** counter.
  * **Overdue tasks** identifier & alert counter.
  * **Today's tasks** scheduled count.
  * **Add Task** quick action button.
  * Visual completion percentage progress bar & priority distribution breakdown.
  * Quick-access recent tasks and upcoming deadlines.
* **How it works:** React queries `/api/tasks/dashboard/` and displays real-time aggregated metrics from Django ORM.

### Module 3: Create Task
* **Features:**
  * Task title (required).
  * Task description.
  * Start date picker.
  * Due date picker (with validation: due date cannot precede start date).
  * Priority selector: **Low**, **Medium**, **High**.
  * Status selector: **To Do**, **In Progress**, **Completed**.
  * Save Task button.
* **How it works:** Form data is posted via Axios to `/api/tasks/`, where Django validates and persists the new task into PostgreSQL with the logged-in user's foreign key.

### Module 4: View & Manage Tasks
* **Features:**
  * View all tasks in responsive card grid with priority badges and status tags.
  * Edit task modal to update title, description, dates, or priority.
  * Delete task modal with confirmation to prevent accidental data loss.
  * View task description & full metadata detail modal.
  * Color-coded priority badges (Low = Emerald, Medium = Amber, High = Crimson) and deadline timestamps.
* **How it works:** React fetches tasks from `/api/tasks/` and handles `GET`, `PUT`, `PATCH`, and `DELETE` requests through Django DRF ViewSets.

### Module 5: Task Status Management
* **Features:**
  * 3-column workflow board: **To Do**, **In Progress**, **Completed**.
  * One-click **Mark as Complete** button.
  * Smooth status transition buttons (Move forward / Move backward).
  * Dynamic column task counters.
* **How it works:** When a user updates a task's stage, an Axios `PATCH` request hits `/api/tasks/{task_id}/update_status/` or `/api/tasks/{task_id}/mark_complete/`, updating the PostgreSQL record instantly.

### Module 6: Calendar & Deadlines
* **Features:**
  * Interactive monthly calendar with previous/next month navigation and "Today" button.
  * Visual task count badges on calendar days.
  * Click any calendar date to view all tasks scheduled for that specific date in the side panel.
  * **Overdue task identification** with high-visibility red alerts and warning indicators for past due dates.
  * Upcoming deadlines panel listing deliverables for the next 7 days.
* **How it works:** The frontend and backend compare task due dates with the current date (`timezone.localdate()`) to compute overdue status and group deliverables by date.

### Module 7: Search & Filter Tasks
* **Features:**
  * Real-time search by task title or description.
  * Filter by priority (**All**, **High**, **Medium**, **Low**).
  * Filter by status (**All**, **To Do**, **In Progress**, **Completed**).
  * Filter by due date (**All**, **Due Today**, **Due This Week**, **Overdue Deadlines**, **Upcoming**).
  * Sort order: Newest, Oldest, Due Date Earliest, Due Date Latest, Title (A-Z).
  * One-click **Clear Filters** button.
* **How it works:** DRF `TaskViewSet.get_queryset` handles query parameters (`search`, `priority`, `status`, `date_filter`, `ordering`) directly via Django ORM SQL filtering.

---

## 🗄️ Database Tables

### 1. `Users` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` / `user_id` | Integer / Primary Key | Unique user identifier |
| `name` | Varchar(255) | User's full name |
| `email` | Varchar(254) / Unique | User's email (login identifier) |
| `password` | Varchar(128) | Secure hashed password (PBKDF2/SHA256) |
| `is_active` | Boolean | Active status flag |
| `date_joined` | DateTime | Timestamp when account was created |

### 2. `Tasks` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `task_id` | AutoField / Primary Key | Unique task identifier |
| `user_id` | ForeignKey (Users) | Associated owner (`on_delete=models.CASCADE`) |
| `title` | Varchar(255) | Task title |
| `description` | Text | Detailed description (optional) |
| `priority` | Varchar(20) | `Low`, `Medium`, or `High` |
| `status` | Varchar(20) | `To Do`, `In Progress`, or `Completed` |
| `start_date` | Date | Start date (optional) |
| `due_date` | Date | Target completion date (optional) |
| `created_date` | DateTime | Timestamp when task was created |
| `updated_date` | DateTime | Timestamp when task was last modified |

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- PostgreSQL (optional for local development; SQLite works out-of-the-box if PostgreSQL is not active)

---

### Backend Setup (Django & DRF)

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. (Optional) Configure PostgreSQL in `backend/.env`:
   ```env
   USE_POSTGRES=True
   DB_NAME=todolist_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```
   *If `USE_POSTGRES` is `False` or unset, Django will automatically use SQLite (`db.sqlite3`) for zero-configuration instant local development.*

4. Apply migrations:
   ```bash
   python manage.py migrate
   ```

5. Seed demo data (creates demo user + 7 sample tasks across all priorities and statuses):
   ```bash
   python manage.py seed_data
   ```

6. Run backend test suite:
   ```bash
   python manage.py test
   ```

7. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   *The backend API will be available at `http://127.0.0.1:8000/api/`.*

---

### Frontend Setup (React & Vite)

1. Open a terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be running at `http://localhost:3000` or `http://localhost:5173`.*

4. Sign in with the seeded demo credentials:
   - **Email:** `demo@example.com`
   - **Password:** `password123`
   *(or click the "Auto Fill" button on the login screen, or create your own account)*

---

## 🧪 Automated Tests

The backend includes a comprehensive test suite in `backend/tasks/tests.py` covering:
- User registration & JWT token generation (Module 1)
- User login with email/password authentication (Module 1)
- User task data isolation (ensuring users can never see another user's tasks)
- Task creation with title, description, priority, dates (Module 3)
- Task editing, retrieval, and deletion (Module 4)
- Task status transition and one-click completion (Module 5)
- Dashboard calculations: Total, Pending, Completed, Overdue, Today (Module 2)
- Multi-field search, priority filters, status filters, and date filters (Module 7)

To run the tests:
```bash
cd backend
python manage.py test
```
Result: **8/8 tests passing (100% success rate)**.

# 🏫 Islah School Management System - Backend API

A comprehensive REST API for managing school operations including student registration, payments, classes, and user authentication.

## Table of Contents

- [Quick Start](#-quick-start)
- [Authentication](#-authentication)
- [API Documentation](#-api-documentation)
- [Endpoints Overview](#️-endpoints-overview)
- [Frontend Integration Guide](#-frontend-integration-guide)
- [Development Setup](#-development-setup)
- [Database Schema](#-database-schema)
- [Testing](#-testing)

## Quick Start

### Prerequisites
- Python 3.10+
- Virtual environment (recommended)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/magicAyyub/islah-app.git
   cd islah-app/backend
   ```

2. **Set up virtual environment**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database**
   ```bash
   python init_db.py
   ```

5. **Start the server**
   ```bash
   # From the parent directory (islah-app/)
   cd ..
   PYTHONPATH=backend uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
   ```

6. **Access the API**
   - **API**: http://127.0.0.1:8000
   - **Interactive Documentation**: http://127.0.0.1:8000/docs
   - **Alternative Docs**: http://127.0.0.1:8000/redoc

## 🔐 Authentication

The API uses **JWT (JSON Web Token)** authentication with role-based access control.

### Default Users

| Username | Password   | Role    | Description                    |
|----------|------------|---------|--------------------------------|
| `admin`  | `admin123` | admin   | Full access to all endpoints   |
| `teacher`| `teacher123`| teacher | Access to students & payments  |

### Authentication Flow

1. **Login to get token**
   ```bash
   curl -X POST "http://127.0.0.1:8000/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"username": "admin", "password": "admin123"}'
   ```

2. **Response**
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "token_type": "bearer",
     "expires_in": 1800
   }
   ```

3. **Use token in requests**
   ```bash
   curl -X GET "http://127.0.0.1:8000/students/" \
        -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### Token Expiration
- **Lifetime**: 30 minutes (1800 seconds)
- **Renewal**: Login again when expired
- **Storage**: Store securely in frontend (localStorage, sessionStorage, or secure cookies)

## API Documentation

### Interactive Documentation
Visit **http://127.0.0.1:8000/docs** for Swagger UI with:
- Live API testing
- Built-in authentication
- Request/response examples
- Detailed parameter descriptions

### Using Swagger UI
1. Open http://127.0.0.1:8000/docs
2. Click **"Authorize"** 🔒 button
3. Login via `/auth/login` endpoint
4. Copy the `access_token` from response
5. Paste token in authorization dialog
6. Test any endpoint!

## Endpoints Overview

### Authentication Endpoints

| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| `POST` | `/auth/login` | ❌ | - | User login |
| `GET` | `/auth/me` | ✅ | Any | Get current user info |
| `POST` | `/auth/register` | ✅ | Admin | Create new user |
| `GET` | `/auth/users` | ✅ | Admin | List all users |
| `PUT` | `/auth/change-password` | ✅ | Any | Change password |
| `PUT` | `/auth/users/{id}/deactivate` | ✅ | Admin | Deactivate user |

###  Student Management

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/students/` | ✅ | List students (with pagination & search) |
| `POST` | `/students/` | ✅ | Create new student |
| `GET` | `/students/{id}` | ✅ | Get student by ID |
| `PUT` | `/students/{id}` | ✅ | Update student |
| `DELETE` | `/students/{id}` | ✅ | Delete student |

###  Payment Management

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/payments/` | ✅ | List payments (with pagination & search) |
| `POST` | `/payments/` | ✅ | Record new payment |
| `GET` | `/payments/{id}` | ✅ | Get payment by ID |
| `PUT` | `/payments/{id}` | ✅ | Update payment |

###  Class Management

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/classes/` | ✅ | List classes |
| `POST` | `/classes/` | ✅ | Create new class |
| `GET` | `/classes/{id}` | ✅ | Get class by ID |

##  Frontend Integration Guide

###  Setting Up API Client

#### JavaScript/React Example
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';

class SchoolAPI {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  // Authentication
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      this.token = data.access_token;
      localStorage.setItem('auth_token', this.token);
      return data;
    }
    throw new Error('Login failed');
  }

  // Generic API call with auth
  async apiCall(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Token expired, redirect to login
      this.logout();
      throw new Error('Authentication required');
    }

    return response.json();
  }

  // Students
  async getStudents(page = 1, size = 20, search = '') {
    const params = new URLSearchParams({ page, size, search });
    return this.apiCall(`/students/?${params}`);
  }

  async createStudent(studentData) {
    return this.apiCall('/students/', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  // Payments
  async getPayments(page = 1, size = 20) {
    const params = new URLSearchParams({ page, size });
    return this.apiCall(`/payments/?${params}`);
  }

  async createPayment(paymentData) {
    return this.apiCall('/payments/', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Auth helpers
  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Usage
const api = new SchoolAPI();

// Login
await api.login('admin', 'admin123');

// Get students
const students = await api.getStudents(1, 20, 'John');

// Create student
const newStudent = await api.createStudent({
  first_name: 'Ahmed',
  last_name: 'Hassan',
  date_of_birth: '2010-05-15',
  gender: 'M',
  // ... other fields
});
```

#### React Hook Example
```javascript
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  const login = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        localStorage.setItem('auth_token', data.access_token);
        
        // Get user info
        const userResponse = await fetch('http://127.0.0.1:8000/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` },
        });
        const userData = await userResponse.json();
        setUser(userData);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  return { user, token, login, logout, isAuthenticated: !!token };
};
```

### API Response Formats

#### Pagination Response
```json
{
  "items": [...],           // Array of items
  "total": 150,            // Total number of items
  "page": 1,               // Current page
  "size": 20,              // Items per page
  "pages": 8,              // Total pages
  "has_next": true,        // Has next page
  "has_previous": false    // Has previous page
}
```

#### Error Response
```json
{
  "detail": "Error message here"
}
```

#### Student Object
```json
{
  "id": 1,
  "first_name": "Ahmed",
  "last_name": "Hassan",
  "date_of_birth": "2010-05-15",
  "gender": "M",
  "parent_id": 1,
  "class_id": 1,
  "registration_status": "confirmed",
  "academic_year": "2024-2025",
  "parent": {
    "first_name": "Mohamed",
    "last_name": "Hassan",
    "phone": "+1234567890"
  }
}
```

### 🔍 Search & Filtering

#### Students Search
```javascript
// Search by name
const results = await api.getStudents(1, 20, 'Ahmed');

// Filter by class
const params = new URLSearchParams({
  page: 1,
  size: 20,
  class_id: 5,
  academic_year: '2024-2025'
});
const classStudents = await api.apiCall(`/students/?${params}`);
```

#### Payments Search
```javascript
// Filter by date range
const params = new URLSearchParams({
  page: 1,
  size: 20,
  date_from: '2024-01-01',
  date_to: '2024-12-31',
  payment_type: 'quarterly'
});
const payments = await api.apiCall(`/payments/?${params}`);
```

## 🔧 Development Setup

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── api/
│   │   ├── dependencies.py     # Auth dependencies
│   │   └── endpoints/          # API routes
│   │       ├── auth.py         # Authentication
│   │       ├── students.py     # Student management
│   │       ├── payments.py     # Payment management
│   │       └── classes.py      # Class management
│   ├── database/
│   │   ├── models.py           # SQLAlchemy models
│   │   └── session.py          # Database connection
│   ├── schemas/                # Pydantic models
│   └── services/               # Business logic
├── tests/                      # Test files
├── init_db.py                  # Database initialization
├── requirements.txt            # Dependencies
└── README.md                   # This file
```

### Environment Variables
Create a `.env` file:
```env
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./islam_school.db
```

### Running Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_students.py

# Run tests in verbose mode
pytest -v

# Run specific test class
pytest tests/test_auth_standalone.py::TestAuthentication -v
```

**Note**: All tests now include proper authentication and will pass with the security measures in place. The test suite includes:
- **Authentication tests** (20 tests) - JWT token management, user roles, password security
- **Student management tests** (1 test) - CRUD operations with authentication
- **Payment tests** (3 tests) - Payment processing with authentication
- **Class management tests** (7 tests) - Class operations with authentication  
- **Pagination & search tests** (17 tests) - Advanced querying with authentication
- **Registration tests** (3 tests) - Student registration workflow

## Database Schema

### Tables Overview

- **users** - System users (admin, teachers)
- **students** - Student information
- **parents** - Parent/guardian information
- **classes** - Class definitions
- **payments** - Payment records

### Key Relationships

- Student → Parent (Many-to-One)
- Student → Class (Many-to-One)
- Payment → Student (Many-to-One)
- Payment → User (processed_by)

## Testing

### Manual Testing with curl

```bash
# Login
TOKEN=$(curl -s -X POST "http://127.0.0.1:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | \
  jq -r '.access_token')

# Get students
curl -X GET "http://127.0.0.1:8000/students/" \
  -H "Authorization: Bearer $TOKEN"

# Create student
curl -X POST "http://127.0.0.1:8000/students/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Ahmed",
    "last_name": "Hassan",
    "date_of_birth": "2010-05-15",
    "gender": "M",
    "parent_id": 1,
    "academic_year": "2024-2025"
  }'
```

## Production Deployment

### Security Considerations

1. **Change default passwords**
2. **Use environment variables for secrets**
3. **Enable HTTPS**
4. **Configure CORS for specific origins**
5. **Use a production database (PostgreSQL)**

### CORS Configuration
Update `main.py` for production:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```


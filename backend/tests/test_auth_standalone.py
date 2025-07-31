import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

from app.main import app
from app.database.models import Base, User
from app.database.session import get_db
from app.services.auth_service import AuthService

# Create test database for auth tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture
def client():
    # Create a fresh database for each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Override dependency only for this test session
    original_override = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = override_get_db
    
    try:
        yield TestClient(app)
    finally:
        # Restore original override
        if original_override:
            app.dependency_overrides[get_db] = original_override
        else:
            app.dependency_overrides.pop(get_db, None)
        
        # Clean up database
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    """Create a fresh database session for each test."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def admin_user(db_session):
    """Create an admin user for testing."""
    user = User(
        username="admin",
        email="admin@school.com",
        first_name="Admin",
        last_name="User",
        role="admin",
        password_hash=AuthService.get_password_hash("admin123"),
        is_active=True,
        created_at=datetime.utcnow()
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def teacher_user(db_session):
    """Create a teacher user for testing."""
    user = User(
        username="teacher",
        email="teacher@school.com",
        first_name="Teacher",
        last_name="User",
        role="teacher",
        password_hash=AuthService.get_password_hash("teacher123"),
        is_active=True,
        created_at=datetime.utcnow()
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def admin_token(client, admin_user):
    """Get admin authentication token."""
    response = client.post("/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })
    return response.json()["access_token"]

@pytest.fixture
def teacher_token(client, teacher_user):
    """Get teacher authentication token."""
    response = client.post("/auth/login", json={
        "username": "teacher",
        "password": "teacher123"
    })
    return response.json()["access_token"]


class TestAuthentication:
    """Test authentication endpoints."""

    def test_login_success(self, client, admin_user):
        """Test successful login."""
        response = client.post("/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_username(self, client):
        """Test login with invalid username."""
        response = client.post("/auth/login", json={
            "username": "nonexistent",
            "password": "admin123"
        })
        assert response.status_code == 401
        assert "detail" in response.json()

    def test_login_invalid_password(self, client, admin_user):
        """Test login with invalid password."""
        response = client.post("/auth/login", json={
            "username": "admin",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        assert "detail" in response.json()

    def test_login_inactive_user(self, client, db_session):
        """Test login with inactive user."""
        # Create inactive user
        inactive_user = User(
            username="inactive",
            email="inactive@school.com",
            first_name="Inactive",
            last_name="User",
            role="teacher",
            password_hash=AuthService.get_password_hash("password123"),
            is_active=False,
            created_at=datetime.utcnow()
        )
        db_session.add(inactive_user)
        db_session.commit()

        response = client.post("/auth/login", json={
            "username": "inactive",
            "password": "password123"
        })
        assert response.status_code == 401
        assert "deactivated" in response.json()["detail"].lower()

    def test_get_current_user(self, client, admin_token):
        """Test getting current user information."""
        response = client.get("/auth/me", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "admin"
        assert data["role"] == "admin"

    def test_get_current_user_invalid_token(self, client):
        """Test getting current user with invalid token."""
        response = client.get("/auth/me", headers={
            "Authorization": "Bearer invalid_token"
        })
        assert response.status_code == 401

    def test_get_current_user_no_token(self, client):
        """Test getting current user without token."""
        response = client.get("/auth/me")
        assert response.status_code == 403


class TestUserManagement:
    """Test user management endpoints."""

    def test_register_user_as_admin(self, client, admin_token):
        """Test user registration by admin."""
        user_data = {
            "username": "newuser",
            "email": "newuser@school.com",
            "first_name": "New",
            "last_name": "User",
            "password": "password123",
            "role": "teacher"
        }
        response = client.post("/auth/register",
                              json=user_data,
                              headers={"Authorization": f"Bearer {admin_token}"})
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "newuser"
        assert data["role"] == "teacher"
        assert "password" not in data

    def test_register_user_as_non_admin(self, client, teacher_token):
        """Test user registration by non-admin."""
        user_data = {
            "username": "newuser2",
            "email": "newuser2@school.com",
            "first_name": "New",
            "last_name": "User",
            "password": "password123",
            "role": "teacher"
        }
        response = client.post("/auth/register", 
                              json=user_data,
                              headers={"Authorization": f"Bearer {teacher_token}"})
        assert response.status_code == 403

    def test_register_duplicate_username(self, client, admin_token, admin_user):
        """Test registering with duplicate username."""
        user_data = {
            "username": "admin",  # Already exists
            "email": "admin2@school.com",
            "first_name": "Admin",
            "last_name": "Two",
            "password": "password123",
            "role": "teacher"
        }
        response = client.post("/auth/register", 
                              json=user_data,
                              headers={"Authorization": f"Bearer {admin_token}"})
        assert response.status_code == 400
        assert "username" in response.json()["detail"].lower()

    def test_register_duplicate_email(self, client, admin_token, admin_user):
        """Test registering with duplicate email."""
        user_data = {
            "username": "admin2",
            "email": "admin@school.com",  # Already exists
            "first_name": "Admin",
            "last_name": "Two",
            "password": "password123",
            "role": "teacher"
        }
        response = client.post("/auth/register", 
                              json=user_data,
                              headers={"Authorization": f"Bearer {admin_token}"})
        assert response.status_code == 400
        assert "email" in response.json()["detail"].lower()

    def test_list_users_as_admin(self, client, admin_token):
        """Test listing users as admin."""
        response = client.get("/auth/users", 
                             headers={"Authorization": f"Bearer {admin_token}"})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1  # At least the admin user

    def test_list_users_as_non_admin(self, client, teacher_token):
        """Test listing users as non-admin."""
        response = client.get("/auth/users", 
                             headers={"Authorization": f"Bearer {teacher_token}"})
        assert response.status_code == 403

    def test_deactivate_user_as_admin(self, client, admin_token, teacher_user):
        """Test deactivating user as admin."""
        response = client.put(f"/auth/users/{teacher_user.id}/deactivate",
                             headers={"Authorization": f"Bearer {admin_token}"})
        assert response.status_code == 200
        data = response.json()
        assert data["is_active"] is False

    def test_deactivate_user_as_non_admin(self, client, teacher_token, admin_user):
        """Test deactivating user as non-admin."""
        response = client.put(f"/auth/users/{admin_user.id}/deactivate",
                             headers={"Authorization": f"Bearer {teacher_token}"})
        assert response.status_code == 403


class TestPasswordManagement:
    """Test password management endpoints."""

    def test_change_password_success(self, client, admin_token):
        """Test successful password change."""
        password_data = {
            "current_password": "admin123",
            "new_password": "newpassword123"
        }
        response = client.put("/auth/change-password",
                             json=password_data,
                             headers={"Authorization": f"Bearer {admin_token}"})
        assert response.status_code == 200

        # Test login with new password
        login_response = client.post("/auth/login", json={
            "username": "admin",
            "password": "newpassword123"
        })
        assert login_response.status_code == 200

    def test_change_password_wrong_current(self, client, admin_token):
        """Test password change with wrong current password."""
        password_data = {
            "current_password": "wrongpassword",
            "new_password": "newpassword123"
        }
        response = client.put("/auth/change-password",
                             json=password_data,
                             headers={"Authorization": f"Bearer {admin_token}"})
        assert response.status_code == 400
        assert "current password" in response.json()["detail"].lower()


class TestAuthService:
    """Test AuthService functionality."""

    def test_password_hashing(self):
        """Test password hashing and verification."""
        password = "testpassword123"
        hashed = AuthService.get_password_hash(password)
        
        assert hashed != password  # Should be hashed
        assert AuthService.verify_password(password, hashed)  # Should verify correctly
        assert not AuthService.verify_password("wrongpassword", hashed)  # Should not verify wrong password

    def test_token_creation_and_verification(self):
        """Test JWT token creation and verification."""
        username = "testuser"
        token = AuthService.create_access_token(data={"sub": username})
        
        assert token is not None
        assert isinstance(token, str)
        
        # Verify token
        payload = AuthService.verify_token(token)
        assert payload is not None
        assert payload.get("sub") == username

    def test_invalid_token_verification(self):
        """Test verification of invalid token."""
        invalid_token = "invalid.token.here"
        payload = AuthService.verify_token(invalid_token)
        assert payload is None

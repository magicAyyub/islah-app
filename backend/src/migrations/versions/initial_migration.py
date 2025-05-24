"""initial migration

Revision ID: initial
Revises: 
Create Date: 2024-04-27 23:40:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text
from sqlalchemy.dialects import postgresql

revision = 'initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create UserRole enum type if it doesn't exist
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    
    # Check if enum type exists
    existing_enums = connection.execute(
        text("SELECT typname FROM pg_type WHERE typname = 'user_role'")
    ).fetchall()
    
    if not existing_enums:
        connection.execute(
            text("CREATE TYPE user_role AS ENUM ('ADMIN', 'STAFF', 'TEACHER', 'PARENT')")
        )
    
    # Create users table if it doesn't exist
    if not inspector.has_table('users'):
        op.create_table(
            'users',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('username', sa.String(length=100), nullable=False),
            sa.Column('password_hash', sa.String(length=255), nullable=False),
            sa.Column('role', postgresql.ENUM('ADMIN', 'STAFF', 'TEACHER', 'PARENT', name='user_role', create_type=False), nullable=False),
            sa.Column('full_name', sa.String(length=255), nullable=False),
            sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
            sa.Column('last_login', sa.DateTime(), nullable=True),
            sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

def downgrade() -> None:
    # Drop table first
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_table('users')
    
    # Then drop enum type
    connection = op.get_bind()
    existing_enums = connection.execute(
        text("SELECT typname FROM pg_type WHERE typname = 'user_role'")
    ).fetchall()
    
    if existing_enums:
        connection.execute(text("DROP TYPE user_role")) 
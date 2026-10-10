"""add job updated timestamp

Revision ID: a1e3f23e7060
Revises: 883ebb8b010c
Create Date: 2026-10-10 00:58:20.288687

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1e3f23e7060'
down_revision: Union[str, Sequence[str], None] = '883ebb8b010c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "jobs",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now()
        )
    )

    op.alter_column(
        "jobs",
        "updated_at",
        server_default=None
    )


def downgrade() -> None:
    op.drop_column("jobs", "updated_at")
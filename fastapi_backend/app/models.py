"""
SQLAlchemy Models
Clean version aligned with simple Prisma schema
"""

from sqlalchemy import Column, String, Integer, DateTime, Enum, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


# ================================
# Enums
# ================================

class SkinType(str, enum.Enum):
    OILY = "OILY"
    DRY = "DRY"
    COMBINATION = "COMBINATION"
    NORMAL = "NORMAL"


class AnalysisStatus(str, enum.Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


# ================================
# User Model
# ================================

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    image = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship with Analysis
    analyses = relationship("Analysis", back_populates="user")


# ================================
# Analysis Model
# ================================

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, index=True)

    # Proper FK relationship
    user_id = Column(String, ForeignKey("users.id"), nullable=True)

    image_url = Column(String, nullable=False)

    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.PENDING)

    # ✅ FINAL FIX — default value added
    skin_type = Column(
        Enum(SkinType),
        nullable=False,
        default=SkinType.NORMAL
    )

    oil = Column(Integer, nullable=True)
    acne = Column(Integer, nullable=True)
    blackheads = Column(Integer, nullable=True)
    pigmentation = Column(Integer, nullable=True)
    hydration = Column(Integer, nullable=True)
    sensitivity = Column(Integer, nullable=True)

    summary = Column(Text, nullable=True)

    ai_raw_json = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship back to User
    user = relationship("User", back_populates="analyses")

import os
import uuid
from typing import Dict, List, Optional, Any
import psycopg
from psycopg.rows import dict_row

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_db_connection() -> psycopg.Connection:
    db_url = os.environ.get("DATABASE_URL") or DATABASE_URL
    if not db_url:
        raise RuntimeError(
            "DATABASE_URL environment variable is not set. "
            "Please configure PostgreSQL DATABASE_URL (e.g. postgresql://user:pass@host:port/dbname)."
        )
    return psycopg.connect(db_url, row_factory=dict_row)


def init_db():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Users Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    hashed_password TEXT NOT NULL,
                    avatar TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # User Ratings Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_ratings (
                    user_id TEXT NOT NULL,
                    movie_id INTEGER NOT NULL,
                    rating REAL NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (user_id, movie_id),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            """)

            # User Watchlist Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_watchlist (
                    user_id TEXT NOT NULL,
                    movie_id INTEGER NOT NULL,
                    status TEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (user_id, movie_id),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            """)
        conn.commit()
    finally:
        conn.close()


def create_user(email: str, name: str, hashed_password: str, avatar: Optional[str] = None) -> dict:
    conn = get_db_connection()
    try:
        user_id = str(uuid.uuid4())
        clean_email = email.strip().lower()
        clean_name = name.strip()
        default_avatar = avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={clean_email}"

        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (id, email, name, hashed_password, avatar)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (user_id, clean_email, clean_name, hashed_password, default_avatar)
            )
        conn.commit()
    finally:
        conn.close()

    return {
        "id": user_id,
        "email": clean_email,
        "name": clean_name,
        "avatar": default_avatar,
        "created_at": None
    }


def get_user_by_email(email: str) -> Optional[dict]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email.strip().lower(),))
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None
    finally:
        conn.close()


def get_user_by_id(user_id: str) -> Optional[dict]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None
    finally:
        conn.close()


def save_user_ratings(user_id: str, ratings: Dict[int, float]):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            for movie_id, rating in ratings.items():
                cursor.execute(
                    """
                    INSERT INTO user_ratings (user_id, movie_id, rating, updated_at)
                    VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
                    ON CONFLICT (user_id, movie_id) DO UPDATE SET
                        rating = EXCLUDED.rating,
                        updated_at = CURRENT_TIMESTAMP
                    """,
                    (user_id, int(movie_id), float(rating))
                )
        conn.commit()
    finally:
        conn.close()


def get_user_ratings(user_id: str) -> Dict[int, float]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT movie_id, rating FROM user_ratings WHERE user_id = %s", (user_id,))
            rows = cursor.fetchall()
            return {int(row["movie_id"]): float(row["rating"]) for row in rows}
    finally:
        conn.close()


def save_user_watchlist(user_id: str, items: List[Dict[str, Any]]):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            for item in items:
                movie_id = item.get("movie_id")
                status = item.get("status", "want_to_watch")
                if movie_id is not None:
                    cursor.execute(
                        """
                        INSERT INTO user_watchlist (user_id, movie_id, status, updated_at)
                        VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
                        ON CONFLICT (user_id, movie_id) DO UPDATE SET
                            status = EXCLUDED.status,
                            updated_at = CURRENT_TIMESTAMP
                        """,
                        (user_id, int(movie_id), str(status))
                    )
        conn.commit()
    finally:
        conn.close()


def get_user_watchlist(user_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT movie_id, status FROM user_watchlist WHERE user_id = %s", (user_id,))
            rows = cursor.fetchall()
            return [{"movie_id": int(row["movie_id"]), "status": row["status"]} for row in rows]
    finally:
        conn.close()


# Initialize schema on module load
init_db()


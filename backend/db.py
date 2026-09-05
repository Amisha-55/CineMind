import os
import sqlite3
import uuid
from typing import Dict, List, Optional, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "cinemind.db")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

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
    conn.close()


def create_user(email: str, name: str, hashed_password: str, avatar: Optional[str] = None) -> dict:
    conn = get_db_connection()
    cursor = conn.cursor()

    user_id = str(uuid.uuid4())
    default_avatar = avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={email}"

    cursor.execute(
        """
        INSERT INTO users (id, email, name, hashed_password, avatar)
        VALUES (?, ?, ?, ?, ?)
        """,
        (user_id, email.strip().lower(), name.strip(), hashed_password, default_avatar)
    )
    conn.commit()
    conn.close()

    return {
        "id": user_id,
        "email": email.strip().lower(),
        "name": name.strip(),
        "avatar": default_avatar,
        "created_at": None
    }


def get_user_by_email(email: str) -> Optional[dict]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    row = cursor.fetchone()
    conn.close()

    if row:
        return dict(row)
    return None


def get_user_by_id(user_id: str) -> Optional[dict]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return dict(row)
    return None


def save_user_ratings(user_id: str, ratings: Dict[int, float]):
    conn = get_db_connection()
    cursor = conn.cursor()

    for movie_id, rating in ratings.items():
        cursor.execute(
            """
            INSERT INTO user_ratings (user_id, movie_id, rating, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, movie_id) DO UPDATE SET
                rating = excluded.rating,
                updated_at = CURRENT_TIMESTAMP
            """,
            (user_id, int(movie_id), float(rating))
        )

    conn.commit()
    conn.close()


def get_user_ratings(user_id: str) -> Dict[int, float]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT movie_id, rating FROM user_ratings WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    conn.close()

    return {int(row["movie_id"]): float(row["rating"]) for row in rows}


def save_user_watchlist(user_id: str, items: List[Dict[str, Any]]):
    conn = get_db_connection()
    cursor = conn.cursor()

    for item in items:
        movie_id = item.get("movie_id")
        status = item.get("status", "want_to_watch")
        if movie_id is not None:
            cursor.execute(
                """
                INSERT INTO user_watchlist (user_id, movie_id, status, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(user_id, movie_id) DO UPDATE SET
                    status = excluded.status,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (user_id, int(movie_id), status)
            )

    conn.commit()
    conn.close()


def get_user_watchlist(user_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT movie_id, status FROM user_watchlist WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    conn.close()

    return [{"movie_id": int(row["movie_id"]), "status": row["status"]} for row in rows]


# Initialize schema on module load
init_db()

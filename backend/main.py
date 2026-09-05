import os
import re
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd

from backend.recommender.recommender_engine import MovieRecommender
from backend.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_optional_current_user
)
from backend.db import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    save_user_ratings,
    get_user_ratings,
    save_user_watchlist,
    get_user_watchlist
)


# ============================================
# CREATE FASTAPI APP
# ============================================

app = FastAPI(
    title="CineMind Movie Recommendation API",
    description="V5 Hybrid Movie Recommendation Engine with Catalog Discovery",
    version="1.1.0"
)

# ============================================
# CORS MIDDLEWARE
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# LOAD RECOMMENDER & PREPARE CATALOG METADATA
# ============================================

recommender = MovieRecommender(
    "backend/recommender/artifacts/v5_recommender_artifacts.pkl"
)

# Build enriched movie catalog lookup
def extract_year(title: str) -> int:
    match = re.search(r"\((\d{4})\)", title)
    return int(match.group(1)) if match else 0

tmdb_map = dict(zip(recommender.movie_mapping["movie_id"], recommender.movie_mapping["tmdb_id"]))
quality_map = recommender.quality_map if isinstance(recommender.quality_map, dict) else dict(recommender.quality_map)

catalog_df = recommender.movies.copy()
catalog_df["tmdb_id"] = catalog_df["movie_id"].map(tmdb_map).fillna(0).astype(int)
catalog_df["quality_score"] = catalog_df["movie_id"].map(quality_map).fillna(3.0).astype(float)
catalog_df["year"] = catalog_df["title"].apply(extract_year)
catalog_df["genres_list"] = catalog_df["genres"].fillna("").apply(lambda g: [x.strip() for x in g.split("|") if x.strip()])

# Extract all unique genres
all_genres = sorted(list(set(
    genre
    for sublist in catalog_df["genres_list"]
    for genre in sublist
    if genre
)))

# Mood to Genre / Filter mapping
MOOD_GENRE_MAP = {
    "feel-good": ["Animation", "Comedy", "Adventure", "Children's", "Romance"],
    "mind-bending": ["Sci-Fi", "Mystery", "Thriller"],
    "make-me-laugh": ["Comedy"],
    "keep-me-up": ["Horror", "Thriller", "Crime"],
    "romance": ["Romance", "Drama"],
    "high-energy": ["Action", "Adventure", "Thriller"],
    "escape-reality": ["Fantasy", "Sci-Fi", "Animation", "Adventure"],
    "dark-twisted": ["Film-Noir", "Crime", "Mystery", "Horror"],
    "deep-thinker": ["Drama", "Documentary", "War"]
}


# ============================================
# REQUEST & RESPONSE MODELS
# ============================================

class RecommendationRequest(BaseModel):
    ratings: Dict[int, float] = Field(
        ...,
        description="MovieLens movie IDs mapped to user ratings (e.g. {318: 5.0, 858: 4.5})"
    )


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(...)
    password: str = Field(..., min_length=6)
    avatar: Optional[str] = None


class LoginRequest(BaseModel):
    email: str = Field(...)
    password: str = Field(...)


class SyncRequest(BaseModel):
    ratings: Optional[Dict[int, float]] = None
    watchlist: Optional[List[Dict[str, Any]]] = None


# ============================================
# HEALTH CHECK
# ============================================

@app.get("/")
def root():
    return {
        "name": "CineMind API",
        "message": "Movie Recommendation API is running",
        "version": "V5",
        "recommender_loaded": recommender is not None,
        "total_movies": len(catalog_df),
        "total_genres": len(all_genres)
    }


# ============================================
# AUTHENTICATION & USER PROFILE ENDPOINTS
# ============================================

@app.post("/auth/register")
def register_user(request: RegisterRequest):
    clean_email = request.email.strip().lower()
    clean_name = request.name.strip()

    if not clean_email or "@" not in clean_email or "." not in clean_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address."
        )

    if len(request.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )

    existing_user = get_user_by_email(clean_email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in."
        )

    hashed_pw = hash_password(request.password)
    user = create_user(
        email=clean_email,
        name=clean_name,
        hashed_password=hashed_pw,
        avatar=request.avatar
    )

    access_token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"]
    })

    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "avatar": user.get("avatar") or f"https://api.dicebear.com/7.x/bottts/svg?seed={user['email']}",
            "created_at": user.get("created_at")
        }
    }


@app.post("/auth/login")
def login_user(request: LoginRequest):
    clean_email = request.email.strip().lower()

    if not clean_email or not request.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required."
        )

    user = get_user_by_email(clean_email)
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )

    access_token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"]
    })

    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "avatar": user.get("avatar") or f"https://api.dicebear.com/7.x/bottts/svg?seed={user['email']}",
            "created_at": user.get("created_at")
        }
    }


@app.get("/auth/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    ratings = get_user_ratings(user_id)
    watchlist = get_user_watchlist(user_id)

    return {
        "success": True,
        "user": current_user,
        "ratings": ratings,
        "watchlist": watchlist
    }


@app.post("/auth/sync")
def sync_user_data(request: SyncRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    if request.ratings is not None:
        save_user_ratings(user_id, request.ratings)

    if request.watchlist is not None:
        save_user_watchlist(user_id, request.watchlist)

    return {
        "success": True,
        "message": "User preferences synchronized successfully"
    }


# ============================================
# CORE ML RECOMMENDATION ENDPOINT
# ============================================

@app.post("/recommend")
def recommend_movies(request: RecommendationRequest):
    try:
        recommendations = recommender.recommend(
            request.ratings
        )

        return {
            "success": True,
            "count": len(recommendations),
            "recommendations": recommendations.to_dict(
                orient="records"
            )
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation engine error: {str(e)}"
        )


# ============================================
# CATALOG & DISCOVERY ENDPOINTS
# ============================================

@app.get("/genres")
def get_genres():
    return {
        "success": True,
        "genres": all_genres
    }


@app.get("/onboarding-catalog")
def get_onboarding_catalog():
    """
    Curated set of recognizable, top-rated movies across diverse genres
    to kickstart user taste onboarding.
    """
    # Prefer movies with known tmdb_id and high quality score
    starter_candidates = catalog_df[
        (catalog_df["tmdb_id"] > 0) & 
        (catalog_df["quality_score"] >= 3.7)
    ].sort_values("quality_score", ascending=False)

    # Pick top movies ensuring genre variety
    selected_ids = set()
    curated_movies = []

    for _, row in starter_candidates.iterrows():
        m_id = int(row["movie_id"])
        if m_id not in selected_ids:
            selected_ids.add(m_id)
            curated_movies.append({
                "movie_id": m_id,
                "title": row["title"],
                "genres": row["genres"],
                "genres_list": row["genres_list"],
                "tmdb_id": int(row["tmdb_id"]),
                "quality_score": round(float(row["quality_score"]), 2),
                "year": int(row["year"])
            })
        if len(curated_movies) >= 28:
            break

    return {
        "success": True,
        "movies": curated_movies
    }


@app.get("/movies")
def get_movies(
    query: Optional[str] = Query(None, description="Search query by title"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    mood: Optional[str] = Query(None, description="Filter by mood preset"),
    min_rating: Optional[float] = Query(None, description="Minimum quality score (0-5)"),
    min_year: Optional[int] = Query(None, description="Minimum release year"),
    max_year: Optional[int] = Query(None, description="Maximum release year"),
    sort_by: Optional[str] = Query("popular", description="Sort criteria: popular, quality, year_desc, year_asc, title"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(24, ge=1, le=100, description="Items per page")
):
    filtered = catalog_df.copy()

    # Search filter
    if query and query.strip():
        q = query.strip().lower()
        filtered = filtered[filtered["title"].str.lower().str.contains(q, na=False)]

    # Genre filter
    if genre and genre != "All":
        filtered = filtered[filtered["genres_list"].apply(lambda glist: genre in glist)]

    # Mood filter
    if mood and mood in MOOD_GENRE_MAP:
        target_genres = MOOD_GENRE_MAP[mood]
        filtered = filtered[filtered["genres_list"].apply(lambda glist: any(g in glist for g in target_genres))]

    # Rating filter
    if min_rating is not None:
        filtered = filtered[filtered["quality_score"] >= min_rating]

    # Year filter
    if min_year is not None:
        filtered = filtered[filtered["year"] >= min_year]
    if max_year is not None:
        filtered = filtered[filtered["year"] <= max_year]

    # Sorting
    if sort_by == "quality" or sort_by == "popular":
        # Sort by quality_score descending, prioritizing mapped tmdb movies
        filtered = filtered.sort_values(
            by=["tmdb_id", "quality_score"],
            ascending=[False, False]
        ) if sort_by == "popular" else filtered.sort_values(by="quality_score", ascending=False)
    elif sort_by == "year_desc":
        filtered = filtered.sort_values(by="year", ascending=False)
    elif sort_by == "year_asc":
        filtered = filtered.sort_values(by="year", ascending=True)
    elif sort_by == "title":
        filtered = filtered.sort_values(by="title", ascending=True)

    total_count = len(filtered)
    total_pages = max(1, (total_count + limit - 1) // limit)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit

    page_items = filtered.iloc[start_idx:end_idx]

    results = []
    for _, row in page_items.iterrows():
        results.append({
            "movie_id": int(row["movie_id"]),
            "title": row["title"],
            "genres": row["genres"],
            "genres_list": row["genres_list"],
            "tmdb_id": int(row["tmdb_id"]),
            "quality_score": round(float(row["quality_score"]), 2),
            "year": int(row["year"])
        })

    return {
        "success": True,
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "movies": results
    }


@app.get("/movies/{movie_id}")
def get_movie_detail(movie_id: int):
    matches = catalog_df[catalog_df["movie_id"] == movie_id]

    if len(matches) == 0:
        raise HTTPException(status_code=404, detail="Movie not found")

    row = matches.iloc[0]

    # V6 enriched metadata lookup
    metadata_matches = recommender.metadata_v6[
        recommender.metadata_v6["movie_id"] == movie_id
    ]

    metadata = {}

    if len(metadata_matches) > 0:
        metadata = metadata_matches.iloc[0].to_dict()

    # Safely handle missing/null values
    def clean_value(value):
        if pd.isna(value):
            return None
        return value

    cast = metadata.get("cast_clean", [])
    crew = metadata.get("key_crew", [])

    if not isinstance(cast, list):
        cast = []

    if not isinstance(crew, list):
        crew = []

    return {
        "success": True,
        "movie": {
            "movie_id": int(row["movie_id"]),
            "title": row["title"],
            "genres": row["genres"],
            "genres_list": row["genres_list"],
            "year": int(row["year"]),
            "tmdb_id": int(row["tmdb_id"]),
            "quality_score": round(float(row["quality_score"]), 2),
            "original_title": clean_value(metadata.get("original_title")),
            "overview": clean_value(metadata.get("overview")),
            "release_date": clean_value(metadata.get("release_date")),
            "vote_average": clean_value(metadata.get("vote_average")),
            "vote_count": clean_value(metadata.get("vote_count")),
            "popularity": clean_value(metadata.get("popularity")),
            "runtime": clean_value(metadata.get("runtime")),
            "tagline": clean_value(metadata.get("tagline")),
            "cast": cast,
            "crew": crew
        }
    }

@app.get("/movies/{movie_id}/similar")
def get_similar_movies(movie_id: int, limit: int = Query(6, ge=1, le=12)):
    """
    Get movies similar to a single movie using the ML recommendation engine.
    """
    try:
        recommendations = recommender.recommend({movie_id: 5.0})
        records = recommendations.head(limit).to_dict(orient="records")
        return {
            "success": True,
            "movie_id": movie_id,
            "similar": records
        }
    except Exception as e:
        # Fallback to genre-matching movies if single movie mapping is absent
        target = catalog_df[catalog_df["movie_id"] == movie_id]
        if len(target) == 0:
            raise HTTPException(status_code=404, detail="Movie not found")
        first_genre = target.iloc[0]["genres_list"][0] if target.iloc[0]["genres_list"] else ""
        fallback = catalog_df[
            (catalog_df["movie_id"] != movie_id) & 
            (catalog_df["genres_list"].apply(lambda gl: first_genre in gl))
        ].sort_values("quality_score", ascending=False).head(limit)
        
        fallback_records = []
        for _, row in fallback.iterrows():
            fallback_records.append({
                "movie_id": int(row["movie_id"]),
                "title": row["title"],
                "genres": row["genres"],
                "tmdb_id": int(row["tmdb_id"]),
                "content_score": 0.8,
                "quality_score": float(row["quality_score"]),
                "final_score": 0.75
            })
        return {
            "success": True,
            "movie_id": movie_id,
            "similar": fallback_records
        }
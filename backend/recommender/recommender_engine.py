import os
import joblib
import numpy as np
import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize

MOVIES_PATH = os.path.join(
    os.path.dirname(__file__),
    "movies.dat"
)

class MovieRecommender:

    def __init__(self, artifact_path):

        # --------------------------------------------
        # Load trained V5 artifacts
        # --------------------------------------------

        artifacts = joblib.load(artifact_path)

        self.tfidf_matrix = artifacts["tfidf_matrix"]
        self.movie_mapping = artifacts["movie_mapping_final"]
        self.svd_model = artifacts["svd_model"]
        self.quality_map = artifacts["quality_map"]
        self.config = artifacts["config"]

        self.content_weight = self.config["content_weight"]
        self.quality_weight = self.config["quality_weight"]
        self.top_k = self.config["top_k"]

        #print("V5 recommender loaded successfully!")
        # --------------------------------------------
        # # Load MovieLens movie metadata
# --------------------------------------------

        self.movies = pd.read_csv(
          MOVIES_PATH,
          sep="::",
          engine="python",
          names=[
           "movie_id",
           "title",
           "genres"
        ],
        encoding="latin-1"
        ) 

        print(
          f"Movie metadata loaded: {len(self.movies)} movies"
        )
                # --------------------------------------------
        # Load V6 enriched movie metadata
        # Cast + Crew + TMDB metadata
        # --------------------------------------------

        V6_METADATA_PATH = os.path.join(
            os.path.dirname(__file__),
            "artifacts",
            "movie_metadata_v6.pkl"
        )

        self.metadata_v6 = pd.read_pickle(
            V6_METADATA_PATH
        )

        print(
            f"V6 metadata loaded: {len(self.metadata_v6)} movies"
        )
    # ============================================
    # BUILD COLD-START USER PROFILE
    # ============================================

    def build_profile(self, ratings):

        """
        ratings example:

        {
            318: 5,
            858: 4,
            527: 5
        }
        """

        valid_indices = []
        valid_ratings = []
        valid_movies = []

        for movie_id, rating in ratings.items():

            matches = self.movie_mapping[
                self.movie_mapping["movie_id"] == movie_id
            ]

            if len(matches) == 0:
                continue

            tfidf_index = matches.index[0]

            valid_indices.append(tfidf_index)
            valid_ratings.append(rating)
            valid_movies.append(movie_id)

        if not valid_indices:
            raise ValueError(
                "None of the selected movies "
                "could be mapped."
            )

        vectors = self.tfidf_matrix[
            valid_indices
        ]

        weights = np.array(
            valid_ratings
        ).reshape(-1, 1)

        profile = vectors.multiply(
            weights
        ).sum(axis=0)

        profile = np.asarray(profile)

        profile = normalize(profile)

        return profile, valid_movies

    # ============================================
    # GENERATE RECOMMENDATIONS
    # ============================================

    def recommend(self, ratings):

        profile, used_movies = self.build_profile(
            ratings
        )

        # --------------------------------------------
        # Content similarity
        # --------------------------------------------

        content_scores = cosine_similarity(
            profile,
            self.tfidf_matrix
        ).flatten()

        recommendations = pd.DataFrame({
            "tfidf_index": range(
                len(content_scores)
            ),
            "content_score": content_scores
        })

        # --------------------------------------------
        # TF-IDF → TMDB → MovieLens
        # --------------------------------------------

        index_to_tmdb = dict(
            zip(
                self.movie_mapping.index,
                self.movie_mapping["tmdb_id"]
            )
        )

        tmdb_to_movie = dict(
            zip(
                self.movie_mapping["tmdb_id"],
                self.movie_mapping["movie_id"]
            )
        )

        recommendations["tmdb_id"] = (
            recommendations["tfidf_index"]
            .map(index_to_tmdb)
        )

        recommendations["movie_id"] = (
            recommendations["tmdb_id"]
            .map(tmdb_to_movie)
        )

        recommendations = recommendations.dropna(
            subset=["movie_id"]
        )

        recommendations["movie_id"] = (
            recommendations["movie_id"]
            .astype(int)
        )

        # --------------------------------------------
        # Remove already-rated movies
        # --------------------------------------------

        recommendations = recommendations[
            ~recommendations["movie_id"].isin(
                used_movies
            )
        ]

        # --------------------------------------------
        # Quality score
        # --------------------------------------------

        recommendations["quality_score"] = (
            recommendations["movie_id"]
            .map(self.quality_map)
        )

        recommendations = recommendations.dropna(
            subset=["quality_score"]
        )

        # --------------------------------------------
        # Normalize scores
        # --------------------------------------------

        cmin = recommendations[
            "content_score"
        ].min()

        cmax = recommendations[
            "content_score"
        ].max()

        qmin = recommendations[
            "quality_score"
        ].min()

        qmax = recommendations[
            "quality_score"
        ].max()

        if cmax != cmin:

            recommendations["content_norm"] = (
                (recommendations["content_score"] - cmin)
                / (cmax - cmin)
            )

        else:

            recommendations["content_norm"] = 0

        if qmax != qmin:

            recommendations["quality_norm"] = (
                (recommendations["quality_score"] - qmin)
                / (qmax - qmin)
            )

        else:

            recommendations["quality_norm"] = 0

        # --------------------------------------------
        # Final hybrid score
        # --------------------------------------------

        recommendations["final_score"] = (
            self.content_weight *
            recommendations["content_norm"]
            +
            self.quality_weight *
            recommendations["quality_norm"]
        )

        # --------------------------------------------
        # Top-K
        # --------------------------------------------

        recommendations = (
            recommendations
            .sort_values(
                "final_score",
                ascending=False
            )
            .head(self.top_k)
        )

        result = recommendations[
            [
                "movie_id",
                "tmdb_id",
                "content_score",
                "quality_score",
                "final_score"
            ]
        ].reset_index(drop=True)

        # Add movie metadata
        result = result.merge(
            self.movies[
                ["movie_id", "title", "genres"]
            ],
            on="movie_id",
            how="left"
        )

        # Arrange columns for frontend/API
        result = result[
            [
                "movie_id",
                "title",
                "genres",
                "tmdb_id",
                "content_score",
                "quality_score",
                "final_score"
            ]
        ]

        return result
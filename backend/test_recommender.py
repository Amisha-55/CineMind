from recommender.recommender_engine import MovieRecommender


recommender = MovieRecommender(
    "backend/recommender/artifacts/v5_recommender_artifacts.pkl"
)


test_ratings = {
    318: 5,
    858: 5,
    527: 5,
    50: 5,
    1198: 5
}


recommendations = recommender.recommend(
    test_ratings
)

print("\nTop Recommendations:")
print(recommendations)
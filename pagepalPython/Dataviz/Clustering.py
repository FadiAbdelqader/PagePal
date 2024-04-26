import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import sys

def get_book_recommendations(book_title, num_recommendations=5):
    similar_books = cosine_sim_df[book_title].sort_values(ascending=False)
    similar_books = similar_books.drop(book_title)
    top_recommendations = similar_books.head(num_recommendations)
    return top_recommendations

if __name__ == "__main__":
    users_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/FilteredUsers.csv')
    ratings_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/UpdatedRatings.csv')
    books_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Books.csv')

    ratings_with_users_df = pd.merge(ratings_df, users_df, on='User-ID', how='left')
    ratings_with_books_df = pd.merge(ratings_with_users_df, books_df, on='ISBN', how='left')

    user_book_ratings = ratings_with_books_df.pivot_table(index='User-ID', columns='Book-Title', values='Book-Rating')
    user_book_ratings = user_book_ratings.fillna(0)

    scaler = MinMaxScaler()
    scaled_ratings = scaler.fit_transform(user_book_ratings)

    cosine_sim = cosine_similarity(scaled_ratings.T, scaled_ratings.T)
    cosine_sim_df = pd.DataFrame(cosine_sim, index=user_book_ratings.columns, columns=user_book_ratings.columns)

    if len(sys.argv) < 2:
        print("Please provide a book title as an argument.")
        sys.exit(1)
    book_title = " ".join(sys.argv[1:])

    # Harry Potter and the Chamber of Secrets (Harry Potter)
    # The No. 1 Ladies' Detective Agency (Today Show Book Club #8)

    recommendations = get_book_recommendations(book_title)
    print(f"People who liked \"{book_title}\" also liked:")
    print(recommendations)

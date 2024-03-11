import sys
import pandas as pd

def get_country_code(location):
    if isinstance(location, str):
        parts = location.split(',')
        if len(parts) > 1:
            return parts[-1].strip()
    return None

def get_book_info(book_title):
    ratings_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/FULLRatings.csv')
    users_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Users.csv')
    books_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/BooksFULL.csv')
    book = books_df[books_df['Book-Title'].str.contains(book_title, case=False)]

    if len(book) == 0:
        return "Book not found."
    else:
        book_isbn = book.iloc[0]['ISBN']
        book_ratings = ratings_df[ratings_df['ISBN'] == book_isbn]

        if len(book_ratings) == 0:
            return "No ratings found for this book."
        else:
            mean_rating = book_ratings['Book-Rating'].mean()
            book_ratings_with_users = pd.merge(book_ratings, users_df, on='User-ID', how='inner')
            mean_age = book_ratings_with_users['Age'].mean()
            main_provenance = get_country_code(book_ratings_with_users['Location'].mode().iloc[0])
            # Get book title and author
            book_title = book.iloc[0]['Book-Title']
            book_author = book.iloc[0]['Book-Author']
            return f"Title: {book_title}, Authors: {book_author}, Mean Rating: {mean_rating:.2f}, Mean Age: {mean_age:.2f}, Main Provenance: {main_provenance}"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python book_info.py <book_title>")
    else:
        book_title = sys.argv[1]
        book_info = get_book_info(book_title)
        print(book_info)

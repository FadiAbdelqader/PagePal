import sys
import pandas as pd
import matplotlib.pyplot as plt


def plot_user_ratings(user_id):
    books_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Books.csv')
    ratings_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Ratings.csv')
    merged_df = pd.merge(books_df, ratings_df, on='ISBN')
    user_ratings = merged_df[merged_df['User-ID'] == user_id]
    category_counts = user_ratings['category'].value_counts()
    top_categories = category_counts.nlargest(5).index
    top_categories_ratings = user_ratings[user_ratings['category'].isin(top_categories)]
    mean_ratings = top_categories_ratings.groupby('category')['Book-Rating'].mean()
    rating_counts = top_categories_ratings.groupby('category').size()
    plt.figure(figsize=(10, 6))
    mean_ratings.plot(kind='bar', color='skyblue', label='Moyenne')
    plt.xlabel('Catégories')
    plt.ylabel('Moyenne')
    plt.title(f"Moyenne des notes données par l'utilisateur {user_id} pour ses 5 catégories les plus notées.")
    plt.xticks(rotation=45, ha='right')
    for i, rating_count in enumerate(rating_counts):
        plt.text(i, mean_ratings[i], f'{rating_count} ratings', ha='center', va='bottom', color='red')
    plt.legend()
    plt.grid(axis='y')
    plt.tight_layout()
    plt.savefig('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/dynamic/userRating.png')

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script_name.py <user_id>")
        sys.exit(1)
    user_id = int(sys.argv[1])
    plot_user_ratings(user_id)

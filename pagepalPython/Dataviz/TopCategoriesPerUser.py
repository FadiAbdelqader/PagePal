import pandas as pd
import matplotlib.pyplot as plt
import sys

def plot_top_categories(user_id):
    ratings_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Ratings.csv')
    books_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Books.csv')
    merged_df = pd.merge(ratings_df, books_df, on='ISBN', how='inner')
    user_ratings = merged_df[merged_df['User-ID'] == user_id]
    category_counts = user_ratings['category'].value_counts()
    top_categories = category_counts.head(5)
    plt.figure(figsize=(8, 8))
    plt.pie(top_categories, labels=top_categories.index, autopct='%1.1f%%', startangle=140)
    plt.title(f"Top 5 Categories lues par l'utilisateur {user_id}")
    plt.axis('equal')
    plt.savefig('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/dynamic/topCategories.png')

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script_name.py <user_id>")
        sys.exit(1)
    user_id = int(sys.argv[1])
    plot_top_categories(user_id)

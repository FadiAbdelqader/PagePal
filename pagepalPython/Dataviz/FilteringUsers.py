import pandas as pd

# Load the CSV files into pandas dataframes
users_df = pd.read_csv('Users.csv')
ratings_df = pd.read_csv('Ratings.csv')
books_df = pd.read_csv('Books.csv')

# Get the ISBNs of the 2370 books
valid_isbns = books_df['ISBN']

# Filter ratings to include only those for the 2370 books
filtered_ratings_df = ratings_df[ratings_df['ISBN'].isin(valid_isbns)]

# Filter users to include only those who have reviewed at least one book from the 2370 books
valid_user_ids = filtered_ratings_df['User-ID'].unique()
filtered_users_df = users_df[users_df['User-ID'].isin(valid_user_ids)]

# Save the filtered dataframes to new CSV files if needed
filtered_ratings_df.to_csv('FilteredRatings.csv', index=False)
filtered_users_df.to_csv('FilteredUsers.csv', index=False)

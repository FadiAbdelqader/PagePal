import pandas as pd

# Load the CSV files into pandas dataframes
ratings_df = pd.read_csv('Ratings.csv')

# List of ISBNs for Harry Potter books
harry_potter_isbns = ['0439064864', '043932162X', '0439358078', '0439554896', '043965548X']

# Filter ratings to include only those for Harry Potter books
harry_potter_ratings_df = ratings_df[ratings_df['ISBN'].isin(harry_potter_isbns)]

# Get the users who liked Harry Potter books
users_liked_harry_potter = harry_potter_ratings_df['User-ID'].unique()

# Create new entries for these users with good ratings for all Harry Potter books
new_entries = []
for user_id in users_liked_harry_potter:
    for isbn in harry_potter_isbns:
        new_entry = {'User-ID': user_id, 'ISBN': isbn, 'Book-Rating': 8}  # Assuming "good" rating is 8
        new_entries.append(new_entry)

# Convert the new entries to a dataframe
new_ratings_df = pd.DataFrame(new_entries)

# Append the new entries to the original ratings dataframe
updated_ratings_df = pd.concat([ratings_df, new_ratings_df], ignore_index=True)

# Save the updated ratings dataframe to a new CSV file
updated_ratings_df.to_csv('UpdatedRatings.csv', index=False)

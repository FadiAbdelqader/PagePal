import pandas as pd
import matplotlib.pyplot as plt

# Read the CSV file into a DataFrame
df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/books.csv')

# Drop rows with missing values in the 'categories' and 'average_rating' columns
df.dropna(subset=['categories', 'average_rating'], inplace=True)

# Define category groups
category_groups = {
    'Adventure & Fantasy': ['Adventure stories', 'Fantasy fiction', 'Science fiction'],
    'Children & Young Adult': ["Children's stories", 'Juvenile Fiction', 'Young Adult Fiction'],
    'Biography & Autobiography': ['Biography & Autobiography'],
    'History & Social Science': ['History', 'Social Science', 'Political Science'],
    'Literature & Arts': ['Literary Criticism', 'Poetry', 'Comics & Graphic Novels', 'Literary Collections', 'Performing Arts'],
    'Philosophy & Religion': ['Philosophy', 'Religion'],
    'Science & Nature': ['Science', 'Nature'],
    'Lifestyle & Health': ['Cooking', 'Body, Mind & Spirit', 'Psychology', 'Health & Fitness', 'Self-Help'],
    'Education & Language': ['Juvenile Nonfiction', 'Language Arts & Disciplines', 'Education', 'Foreign Language Study'],
    'Business & Economics': ['Business & Economics'],
    'Other Non-Fiction': ['Computers', 'Family & Relationships', 'Humor', 'Medical', 'Games', 'Music', 'Sports & Recreation', 'Detective and mystery stories', 'True Crime', 'Law', 'Photography', 'Reference', 'Authors, American', 'Architecture', 'Travel']
}

# Create a new DataFrame to store the mean ratings of books per year for each category group
mean_ratings_per_year = pd.DataFrame(index=df['published_year'].unique(), columns=category_groups.keys())

# Group by published year and calculate the mean ratings of books in each category group
for group, categories in category_groups.items():
    relevant_df = df[df['categories'].str.contains('|'.join(categories))]
    mean_ratings = relevant_df.groupby('published_year')['average_rating'].mean()
    mean_ratings_per_year[group] = mean_ratings

# Plot the mean ratings of books per year for each category group using a bar plot
plt.figure(figsize=(12, 8))

for group in mean_ratings_per_year.columns:
    plt.bar(mean_ratings_per_year.index, mean_ratings_per_year[group], label=group, alpha=0.7)

plt.title('Mean Ratings of Books per Year in Specific Category Groups')
plt.xlabel('Year')
plt.ylabel('Mean Rating')
plt.legend(title='Category Group', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.grid(axis='y')
plt.ylim(0, 5)  # Limit the y-axis range to better highlight differences
plt.xlim(2000, 2020)  # Limit the range of years displayed
plt.tight_layout()
plt.savefig('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/graph.png') # Update '/path/to/your/directory/' to the actual path where you want to save the image

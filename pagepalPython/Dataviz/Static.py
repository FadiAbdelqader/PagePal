import pandas as pd
import matplotlib.pyplot as plt

# Top reviewers
ratings_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Ratings.csv')
user_ratings_count = ratings_df['User-ID'].value_counts()
top_reviewers = user_ratings_count.head(5)
colors = ['gold', 'silver', 'darkorange', 'lightgray', 'lightgray']
plt.figure(figsize=(10, 6))
plt.bar(top_reviewers.index.astype(str), top_reviewers.values, color=colors)
plt.xlabel('User ID')
plt.ylabel('Nombre de reviews')
plt.title('Top 5 reviewers')
plt.savefig('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/static/topReviewers.png')

# Top categories per year range
books_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Books.csv')
users_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Users.csv')
ratings_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Ratings.csv')
merged_df = pd.merge(ratings_df, users_df, on='User-ID', how='left')
merged_df = pd.merge(merged_df, books_df, on='ISBN', how='left')
top_categories = merged_df[merged_df['categories'] != 'FICTION']['categories'].value_counts().nlargest(10).index
merged_df = merged_df[merged_df['categories'].isin(top_categories)]
age_bins = [10, 15, 21, 30, 40, 50, 60, 70, 120]
age_labels = ['10-15', '16-21', '22-30', '31-40', '41-50', '51-60', '61-70', '70+']
merged_df['Age-Group'] = pd.cut(merged_df['Age'], bins=age_bins, labels=age_labels, right=False)
ratings_by_age_category = merged_df.groupby(['Age-Group', 'categories']).size().unstack(fill_value=0)
plt.figure(figsize=(12, 6))
ratings_by_age_category.plot(kind='bar', stacked=True, ax=plt.gca())
plt.title("Les 10 catégories les plus lues en fonction de l'âge.")
plt.xlabel('Age')
plt.ylabel('Number de notes')
plt.xticks(rotation=45, ha='right')
plt.legend(title='Catégories', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.savefig('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/static/topCategoriesPerYear.png')


# Categories publication evolution
df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Books.csv')
grouped = df.groupby(['Year-Of-Publication', 'category']).size().unstack(fill_value=0)
category_totals = grouped.sum(axis=0)
top_categories = category_totals.nlargest(10).index
grouped_top = grouped[top_categories]
grouped_top.plot(kind='bar', stacked=True, figsize=(12, 6))
plt.title('Top 10 Categories: Nombre de livres publiés par catégories')
plt.xlabel('Années de publication')
plt.ylabel('Nombre de livres')
plt.legend(title='Catégories', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.savefig('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/static/publicationEvolution.png')

# Top countries
users_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Users.csv')
ratings_df = pd.read_csv('FULLRatings.csv')
merged_df = pd.merge(ratings_df, users_df, on='User-ID', how='inner')
merged_df['Country'] = merged_df['Location'].str.split(',').str[-1].str.strip()
merged_df = merged_df[merged_df['Country'].isin(['', 'n/a']) == False]
country_reviews = merged_df['Country'].value_counts().head(10)
country_reviews.plot(kind='bar', figsize=(10, 6))
plt.xlabel('Country')
plt.ylabel('Number of Reviews')
plt.title('Top 10 Countries with Most Reviews')
plt.xticks(rotation=45)
plt.grid(axis='y')
plt.tight_layout()
plt.savefig('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/static/topCountries.png')
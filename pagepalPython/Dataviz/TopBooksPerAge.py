import pandas as pd
import matplotlib.pyplot as plt

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
plt.savefig('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/dynamic/topBooksPerAge.png')

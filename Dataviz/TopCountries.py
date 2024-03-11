import pandas as pd
import matplotlib.pyplot as plt

users_df = pd.read_csv('Users.csv')
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
plt.show()

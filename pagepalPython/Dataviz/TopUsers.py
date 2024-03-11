import pandas as pd
import matplotlib.pyplot as plt

# top reviewers
ratings_df = pd.read_csv('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Ratings.csv')
user_ratings_count = ratings_df['User-ID'].value_counts()
top_reviewers = user_ratings_count.head(5)
colors = ['gold', 'silver', 'darkorange', 'lightgray', 'lightgray']
plt.figure(figsize=(10, 6))
plt.bar(top_reviewers.index.astype(str), top_reviewers.values, color=colors)
plt.xlabel('User ID')
plt.ylabel('Nombre de reviews')
plt.title('Top 5 reviewers')
plt.savefig('/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/dynamic/topUsers.png')


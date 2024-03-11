import pandas as pd
import matplotlib.pyplot as plt

# Categories publication evolution
df = pd.read_csv('Books.csv')
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
plt.show()

import sys
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from gensim.models import KeyedVectors
from nltk.tokenize import word_tokenize
import nltk
nltk.download('punkt')

# Read the CSV files
#users_df = pd.read_csv('Users.csv')
#ratings_df = pd.read_csv('Ratings.csv')
books_df = pd.read_csv('booksForNLP.csv')

# Drop the 'isbn13' column
books_df.drop(columns=['isbn13'], inplace=True)

# Filter out rows with NaN description values
books_df.dropna(subset=['description'], inplace=True)

# Load pre-trained word embeddings (Google News Word2Vec model)
word2vec_model = KeyedVectors.load_word2vec_format('C:/Users/Fadi/Desktop/GoogleNews-vectors-negative300.bin', binary=True, limit=500000)

# Function to get average word vector for a list of keywords
def get_average_word_vector(description):
    if isinstance(description, str):
        tokens = word_tokenize(description.lower())
        word_vectors = [word2vec_model[word] for word in tokens if word in word2vec_model]
        if word_vectors:
            return np.mean(word_vectors, axis=0)
    return np.zeros(word2vec_model.vector_size)

# Apply word vectorization to book descriptions
books_df['description_vector'] = books_df['description'].apply(get_average_word_vector)

# Number of clusters
k = 4

# Apply K-means clustering with the chosen number of clusters
kmeans = KMeans(n_clusters=k)
kmeans.fit(np.stack(books_df['description_vector'].values))
clusters = kmeans.labels_

# Function to recommend books based on keywords
def recommend_books(keywords, n_recommendations=3):
    description_vector = get_average_word_vector(' '.join(keywords))
    predicted_cluster = kmeans.predict([description_vector])[0]
    cluster_books = books_df[clusters == predicted_cluster]
    if len(cluster_books) == 0:
        print("No recommendations found in the cluster.")
        return None
    # Calculate similarity between keyword vector and each book's description vector
    cluster_books['similarity'] = cluster_books['description_vector'].apply(lambda x: np.dot(description_vector, x) / (np.linalg.norm(description_vector) * np.linalg.norm(x)))
    # Sort by similarity and get top recommendations
    recommendations = cluster_books.nlargest(n_recommendations, 'similarity')
    return recommendations[['title', 'authors', 'description']]

# Extract keywords from command-line arguments
keywords = sys.argv[1:]

# Example usage:
if keywords:
    recommendations = recommend_books(keywords)
    if recommendations is not None:
        print("Recommended Book(s):")
        print(recommendations)
else:
    print("Please provide keywords as arguments.")

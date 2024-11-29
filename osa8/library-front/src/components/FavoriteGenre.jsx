import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';

const GET_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

const ME_QUERY = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

const FavoriteGenre = () => {
  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
  } = useQuery(GET_BOOKS);
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(ME_QUERY);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    if (booksData && userData) {
      const favoriteGenre = userData.me.favoriteGenre;
      if (favoriteGenre) {
        const filtered = booksData.allBooks.filter((book) =>
          book.genres.includes(favoriteGenre)
        );
        setFilteredBooks(filtered);
      }
    }
  }, [booksData, userData]);

  if (booksLoading || userLoading) return <p>Loading...</p>;
  if (booksError) return <p>Error loading books: {booksError.message}</p>;
  if (userError) return <p>Error loading user: {userError.message}</p>;

  return (
    <div className="container mt-4">
      <h2>
        Your favorite genre: {userData.me.favoriteGenre || 'None selected'}
      </h2>

      {filteredBooks.length === 0 ? (
        <p>No books found for your favorite genre.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FavoriteGenre;

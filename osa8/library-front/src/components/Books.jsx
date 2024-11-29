import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';

const GET_BOOKS = gql`
  query {
    allBooks {
      id
      title
      author {
        id
        name
      }
      published
      genres
    }
  }
`;

const Books = (props) => {
  const { loading, error, data, refetch } = useQuery(GET_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    if (props.show) {
      refetch();
    }
  }, [props.show, refetch]);

  useEffect(() => {
    if (data) {
      setFilteredBooks(data.allBooks);
    }
  }, [data]);

  const handleGenreChange = (event) => {
    const genre = event.target.value;
    setSelectedGenre(genre);

    if (genre === '') {
      setFilteredBooks(data.allBooks);
    } else {
      const filtered = data.allBooks.filter((book) =>
        book.genres.includes(genre)
      );
      setFilteredBooks(filtered);
    }
  };

  if (!props.show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const allGenres = [...new Set(data.allBooks.flatMap((book) => book.genres))];

  return (
    <div className="container mt-4">
      <h2>Books</h2>

      <div className="mb-3">
        <label>Select genre:</label>
        <select
          className="form-control"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">All genres</option>
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;

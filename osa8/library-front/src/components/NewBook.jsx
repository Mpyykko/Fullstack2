import { useState } from 'react';
import { useMutation } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ADD_BOOK, GET_BOOKS, GET_AUTHORS } from '../queries';

const NewBook = ({ show, notify }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }, { query: GET_AUTHORS }],
    update(cache, { data: { addBook } }) {
      cache.updateQuery({ query: GET_BOOKS }, (data) => {
        if (data) {
          return {
            allBooks: [...data.allBooks, addBook],
          };
        }
        return data;
      });
    },
    onError: (error) => {
      console.error('Error adding book:', error);
      notify('Error adding book!');
    },
  });

  if (!show) return null;

  const submit = async (event) => {
    event.preventDefault();

    if (!title || !author || !published || genres.length === 0) {
      notify('All fields are required!');
      return;
    }

    try {
      await addBook({
        variables: {
          title,
          author,
          published: parseInt(published),
          genres,
        },
      });

      setTitle('');
      setAuthor('');
      setPublished('');
      setGenres([]);
      setGenre('');

      notify('Book added successfully!', 'success');
    } catch (error) {
      console.error('Error adding book:', error);
      notify('Error adding book!');
    }
  };

  const addGenre = () => {
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre]);
    }
    setGenre('');
  };

  return (
    <div className="container mt-4">
      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            value={title}
            className="form-control"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author
          </label>
          <input
            id="author"
            value={author}
            className="form-control"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="published" className="form-label">
            Published
          </label>
          <input
            type="number"
            id="published"
            className="form-control"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-outline-primary ms-2"
            style={{ width: '100px' }}
            onClick={addGenre}
          >
            Add genre
          </button>
          <input
            type="text"
            id="genre"
            className="form-control"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
        </div>
        <div>Genres: {genres.join(' ')}</div>
        <button type="submit" className="btn btn-success">
          Create book
        </button>
      </form>
    </div>
  );
};

export default NewBook;

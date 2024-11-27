import React, { useState } from 'react';
import blogService from '../services/blogs';
import 'bootstrap/dist/css/bootstrap.min.css';

const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const createBlog = async (event) => {
    event.preventDefault();
    console.log('Nykyinen token:', blogService.token);

    const newBlog = {
      title,
      author,
      url,
    };

    try {
      const response = await blogService.create(newBlog);

      handleNewBlog(response);
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      console.error(
        'Blogin luomisvirhe:',
        error.response ? error.response.data : error
      );

      if (error.response) {
        alert(`Virhe blogin luomisessa: ${error.response.data.error}`);
      } else {
        alert('Blogin luomisessa tapahtui virhe');
      }
    }
  };
  return (
    <form onSubmit={createBlog} className="p-3 border rounded">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title:
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          className="form-control"
          placeholder="Enter blog title"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="author" className="form-label">
          Author:
        </label>
        <input
          type="text"
          name="author"
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          className="form-control"
          placeholder="Enter author name"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="url" className="form-label">
          URL:
        </label>
        <input
          type="text"
          name="url"
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          className="form-control"
          placeholder="Enter blog URL"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        style={{ maxWidth: '150px' }}
      >
        Create
      </button>
    </form>
  );
};
export default BlogForm;

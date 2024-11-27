import React, { useState, useEffect } from 'react';
import blogs from '../services/blogs';
import 'bootstrap/dist/css/bootstrap.min.css';

const Blog = ({ blog, handleLikeUpdate, handleDeleteBlog, user }) => {
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(blog.comments || []);
  const [isCommenting, setIsCommenting] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  useEffect(() => {
    setComments(blog.comments || []);
  }, [blog]);

  const toggleView = () => {
    setExpanded(!expanded);
  };
  const addLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: likes + 1,
    };
    const response = await blogs.update(blog.id, updatedBlog);
    setLikes(response.likes);
    handleLikeUpdate(response);
  };

  const deleteBlog = async () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
    if (confirmDelete) {
      try {
        await blogs.deleteBlog(blog.id);
        handleDeleteBlog(blog.id);
      } catch (error) {
        console.error('Failed to remove the blog:', error);
      }
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const [error, setError] = useState('');

  const addComment = async (event) => {
    event.preventDefault();

    if (!newComment.trim()) {
      setError('Comment can not be empty.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await blogs.addComment(blog.id, { content: newComment });
      setComments([...comments, response]);
      setNewComment('');
      setError('');
      setIsCommenting(false);
    } catch (error) {
      console.error('Failing add comment:', error);
      setError('Failing add comment. Try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const cancelComment = () => {
    setNewComment('');
    setError('');
    setIsCommenting(false);
  };

  const isAuthor = user && blog.user.username === user.username;

  return (
    <div
      data-testid="blogit"
      className="card mb-3"
      style={{ maxWidth: '600px', margin: 'auto' }}
    >
      <div className="card-body">
        <h5 className="card-title">Blog: {blog.title}</h5>
        <button
          data-testid="show-more"
          className="btn btn-primary btn-sm mb-3"
          onClick={toggleView}
        >
          {expanded ? 'Hide' : 'Show more'}
        </button>
        {expanded && (
          <div>
            <p className="card-text">
              <strong>Writer:</strong> {blog.author}
            </p>
            <p className="card-text">
              <strong>URL:</strong>{' '}
              <a href={blog.url} target="_blank" rel="noopener noreferrer">
                {blog.url}
              </a>
            </p>
            <p className="card-text">
              <strong>Likes:</strong> {blog.likes}
              <button
                data-testid="like-button"
                className="btn btn-success btn-sm ms-3"
                onClick={addLike}
              >
                Like
              </button>
              {isAuthor && (
                <button
                  data-testid="delete-button"
                  className="btn btn-danger btn-sm ms-3"
                  onClick={deleteBlog}
                >
                  Delete
                </button>
              )}
            </p>

            <div>
              <h6 className="mb-3">Comments:</h6>
              <ul className="list-unstyled">
                {comments.map((comment, index) => (
                  <li
                    key={index}
                    className="mb-3 p-3 border rounded shadow-sm bg-light"
                    style={{ transition: 'transform 0.3s', cursor: 'pointer' }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = 'scale(1.3)')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = 'scale(1)')
                    }
                  >
                    <p>{comment.content}</p>
                  </li>
                ))}
              </ul>
              {isCommenting ? (
                <form onSubmit={addComment}>
                  <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add comment"
                    className="form-control mb-2"
                  />
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cancelComment}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="btn btn-info"
                  onClick={() => setIsCommenting(true)}
                >
                  Add comment
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

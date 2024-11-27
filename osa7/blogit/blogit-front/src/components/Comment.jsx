import React, { useState, useEffect } from 'react';
import blogService from '../services/blogs';
import { useParams } from 'react-router-dom';

const Comment = () => {
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const { id } = useParams();

  useEffect(() => {
    blogService.getBlog(id).then((data) => {
      setBlog(data);
    });
  }, [id]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    if (comment.trim() !== '') {
      blogService.addComment(id, comment).then((newComment) => {
        setBlog({
          ...blog,
          comments: [...blog.comments, newComment],
        });
        setComment('');
      });
    }
  };

  return blog ? (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.author}</p>
      <p>{blog.url}</p>
      <h3>Comments</h3>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment.content}</li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  ) : (
    <p>Loading blog...</p>
  );
};

export default Comment;

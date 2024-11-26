import React, { useState } from 'react'
import blogs from '../services/blogs'
import 'bootstrap/dist/css/bootstrap.min.css'

const Blog = ({ blog, handleLikeUpdate, handleDeleteBlog, user }) => {
  const [expanded, setExpanded] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const toggleView = () => {
    setExpanded(!expanded)
  }
  const addLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: likes + 1,
    }
    const response = await blogs.update(blog.id, updatedBlog)
    setLikes(response.likes)
    handleLikeUpdate(response)
  }
  
  const deleteBlog = async () => {
    const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (confirmDelete) {
      try {
        await blogs.deleteBlog(blog.id)
        handleDeleteBlog(blog.id)
      } catch (error) {
        console.error('Failed to remove the blog:', error)
      }
    }
  }
  const isAuthor = user && blog.user.username === user.username
  return (
    <div
      data-testid="blogit"
      className="card mb-3"
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      <div className="card-body">
        <h5 className="card-title">Blog: {blog.title}</h5>
        <button
          data-testid="show-more"
          className="btn btn-primary btn-sm mb-3"
          onClick={toggleView}
        >
          {expanded ? "Hide" : "Show more"}
        </button>
        {expanded && (
          <div>
            <p className="card-text">
              <strong>Writer:</strong> {blog.author}
            </p>
            <p className="card-text">
              <strong>URL:</strong>{" "}
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
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
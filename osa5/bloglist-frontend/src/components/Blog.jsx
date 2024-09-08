import React, { useState } from 'react'
import blogs from '../services/blogs'
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
    <div data-testid="blogit" style={blogStyle}>
        Blogs name: {blog.title}
        <button data-testid="show-more" onClick={toggleView}>
          {expanded ? 'Hide' : 'Show more'}
      </button>
      {expanded && (
        <div>
          <p>Writer: {blog.author}</p>
          <p>Url: {blog.url}</p>
          <p>Likes: {blog.likes}
            <button data-testid="like-button" onClick={addLike}>
            Like
            </button>
            {isAuthor && (
              <button data-testid="delete-button" onClick={deleteBlog}>Delete</button>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default Blog
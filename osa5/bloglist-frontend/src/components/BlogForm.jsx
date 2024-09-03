import React, { useState } from 'react'
import blogService from '../services/blogs'
const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const createBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url,
    }
    try {
      const response = await blogService.create(newBlog)
      handleNewBlog(response)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.error('Failed to create blog:', error)
    }
  }
  return (
    <form onSubmit={createBlog}>
      <div>
        Title:
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author:
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL:
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}
export default BlogForm

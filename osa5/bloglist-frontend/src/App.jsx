import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

import BlogForm from './components/BlogForm'







const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

 

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(initialBlogs =>
        setBlogs(initialBlogs)
      )
    }
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()
  
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({
        message: `Welcome ${user.name}!`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (exception) {
      console.error('Login failed:', exception)
      setNotification({
        message: 'Wrong credentials',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleNewBlog = (newBlog) => {
    setBlogs([...blogs, newBlog])
    setNotification({
      message: `New blog ${newBlog.title} by ${newBlog.author} added!`,
      type: 'success'
    }),
    <Notification notification={notification} />
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <div>
    {!user ? (
      <div>
        <h1>Log in</h1>
        <Notification notification={notification} />
        {loginForm()}
      </div>
    ) : (
      <div>
        <Notification notification={notification} />
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
        <h2>Create new blog</h2>
          <BlogForm handleNewBlog={handleNewBlog} />
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )}
  </div>
  )
}

export default App

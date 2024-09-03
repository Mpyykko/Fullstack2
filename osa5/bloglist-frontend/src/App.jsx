import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
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
        message: 'Wrong username or password',
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
  const handleNewBlog = (newBlog) => {
    setBlogs([...blogs, newBlog])
    setNotification({
      message: `New blog ${newBlog.title} by ${newBlog.author} added!`,
      type: 'success'
    })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }
  const handleLikeUpdate = (updatedBlog) => {
    setBlogs(blogs.map(blog =>
      blog.id === updatedBlog.id ? updatedBlog : blog
    ))
  }
  const handleDeleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }
  return (
    <div>
      <h1>Blogs</h1>
      <Notification notification={notification} />
      {!user ? (
        <Togglable buttonLabel="Log in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} Logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <Togglable buttonLabel="New blog">
            <BlogForm handleNewBlog={handleNewBlog} />
          </Togglable>
          <h2>Blogs</h2>
          {blogs.sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id}blog={blog}
                handleLikeUpdate={handleLikeUpdate}
                handleDeleteBlog={handleDeleteBlog}
                user={user}/>
            )}
        </div>
      )}
    </div>
  )
}
export default App

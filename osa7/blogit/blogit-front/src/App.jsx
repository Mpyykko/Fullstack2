import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import Users from './components/Users';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      console.log('Kirjautumisen token:', user.token)
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      setNotification({
        message: `Welcome ${user.name}!`,
        type: 'success',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (exception) {
      console.error('Login failed:', exception);
      setNotification({
        message: 'Wrong username or password',
        type: 'error',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
  };

  const handleNewBlog = (newBlog) => {
    setBlogs([...blogs, newBlog]);
    setNotification({
      message: `New blog ${newBlog.title} by ${newBlog.author} added!`,
      type: 'success',
    });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleLikeUpdate = (updatedBlog) => {
    setBlogs(blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)));
  };

  const handleDeleteBlog = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <Router>
      <div className="container my-4">
      <Notification notification={notification} />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <div className="navbar-nav">
            <NavLink className="nav-item nav-link text-light" to="/">
              Blogs
            </NavLink>
            {user && (
              <NavLink className="nav-item nav-link text-light" to="/users">
                Users
              </NavLink>
            )}
          </div>
          {user && (
            <div className="ml-auto d-flex align-items-center">
              <span className="navbar-text mr-3 text-light">{user.name} logged in</span>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {!user && (
        <div className="card mx-auto p-4 mb-4" style={{ maxWidth: '400px' }}>
          <h2 className="text-center mb-3">Log in</h2>
          <Togglable buttonLabel="Log in">
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <div>
              {user && (
                <Togglable buttonLabel="New blog">
                  <div className="card p-4 mb-4">
                    <h3 className="mb-3">Create a new blog</h3>
                    <BlogForm handleNewBlog={handleNewBlog} />
                  </div>
                </Togglable>
              )}

              <h2 className="mb-3">Blogs</h2>
              <div className="list-group">
                {blogs
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <div key={blog.id} className="list-group-item">
                      <Blog
                        blog={blog}
                        handleLikeUpdate={handleLikeUpdate}
                        handleDeleteBlog={handleDeleteBlog}
                        user={user}
                      />
                    </div>
                  ))}
              </div>
            </div>
          }
        />
        {user && <Route path="/users" element={<Users />} />}
      </Routes>
      </div>
    </Router>
  );
};

export default App;
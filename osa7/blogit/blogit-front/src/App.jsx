import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from 'react-router-dom';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import UsersList from './components/UsersList';
import UserDetail from './components/UserDetail';
import userService from './services/users';
import {
  setNotification,
  clearNotification,
} from './reducers/notificationReducer';
import { setBlogs, addBlog } from './reducers/blogReducer';
import { setUser, clearUser } from './reducers/userReducer';
import { setUsers } from './reducers/usersReducer';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  useEffect(() => {
    blogService
      .getAll()
      .then((initialBlogs) => dispatch(setBlogs(initialBlogs)));
  }, [dispatch]);

  useEffect(() => {
    userService.getAll().then((users) => {
      dispatch(setUsers(users));
    });
  }, [dispatch]);

  const showNotification = (message, type = 'success') => {
    dispatch(setNotification({ message, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername('');
      setPassword('');
      showNotification(`Welcome ${user.name}!`);
    } catch (exception) {
      showNotification('Wrong username or password', 'error');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(clearUser());
    blogService.setToken(null);
  };

  const handleNewBlog = (newBlog) => {
    dispatch(addBlog(newBlog));
    showNotification(`New blog ${newBlog.title} by ${newBlog.author} added!`);
  };

  const handleLikeUpdate = (updatedBlog) => {
    dispatch(
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      )
    );
  };

  const handleDeleteBlog = (id) => {
    dispatch(setBlogs(blogs.filter((blog) => blog.id !== id)));
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <Router>
      <div className="container my-4">
        <Notification />
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <div className="container">
            <div className="navbar-nav">
              <NavLink
                className="nav-item nav-link text-light fs-4 px-3 py-2 rounded hover-effect"
                to="/"
              >
                {' '}
                Blogs{' '}
              </NavLink>
              {user && (
                <NavLink
                  className="nav-item nav-link text-light fs-4 px-3 py-2 rounded hover-effect"
                  to="/users"
                >
                  Users
                </NavLink>
              )}
            </div>
            <h1 className="navbar-text mx-auto text-light">Blog App</h1>
            {user && (
              <div className="d-flex flex-column align-items-center ml-auto">
                <span className="navbar-text mr-3 text-light">
                  {user.name} logged in
                </span>
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
        {!user && (
          <div className="card mx-auto p-4 mb-4" style={{ maxWidth: '400px' }}>
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
                  {sortedBlogs.map((blog) => (
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
          <Route path="/users" element={<UsersList users={users} />} />
          <Route path="/users/:id" element={<UserDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

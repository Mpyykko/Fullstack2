import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notify from './components/Notify';
import LoginForm from './components/LoginForm';
import { useQuery } from '@apollo/client';
import UserFavoriteGenre from './components/FavoriteGenre';
import { ALL_PERSONS } from './queries';
import Subscription from './components/Subscription';

const App = () => {
  const result = useQuery(ALL_PERSONS);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [token, setToken] = useState(null);
  const [currentView, setCurrentView] = useState('authors');
  const [books, setBooks] = useState([]);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const notify = (message, type = 'error') => {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 2000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <Notify message={message} type={messageType} />
        <div className="card p-4 shadow-sm">
          <h2 className="mb-3 text-center">Login</h2>
          <LoginForm setToken={setToken} setError={notify} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Notify message={message} type={messageType} />
      {token && (
        <>
          <nav className="mb-4">
            <button
              className={`btn ${currentView === 'authors' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setCurrentView('authors')}
            >
              Authors
            </button>
            <button
              className={`btn ${currentView === 'books' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setCurrentView('books')}
            >
              Books
            </button>
            <button
              className={`btn ${currentView === 'newBook' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setCurrentView('newBook')}
            >
              New Book
            </button>
            <button
              className={`btn ${currentView === 'favoriteGenre' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setCurrentView('favoriteGenre')}
            >
              Recomendations
            </button>
            <button className="btn btn-warning me-2" onClick={logout}>
              Logout
            </button>
          </nav>
          {currentView === 'authors' && <Authors show={true} />}
          {currentView === 'books' && <Books show={true} />}
          {currentView === 'newBook' && <NewBook show={true} notify={notify} />}
          {currentView === 'favoriteGenre' && <UserFavoriteGenre />}
          <Subscription setBooks={setBooks} />
        </>
      )}
    </div>
  );
};

export default App;

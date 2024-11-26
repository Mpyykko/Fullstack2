import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import 'bootstrap/dist/css/bootstrap.min.css';
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import { useQuery, useApolloClient } from '@apollo/client'

import { ALL_PERSONS } from './queries'


const App = () => {
  const result = useQuery(ALL_PERSONS)
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [currentView, setCurrentView] = useState('authors');
  const client = useApolloClient()
  
  if (result.loading)  {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 2000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div className="container mt-5">
        <Notify errorMessage={errorMessage} />
      
        <div className="card p-4 shadow-sm">
          <h2 className="mb-3 text-center">Login</h2>
          <LoginForm setToken={setToken} setError={notify} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <Notify errorMessage={errorMessage} />
      {!token && (
        <>
          <LoginForm setToken={setToken} setError={notify} />
        </>
      )}
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
            <button className="btn btn-warning me-2" onClick={logout}>
            Logout
          </button>
          </nav>
          {currentView === 'authors' && <Authors show={true} />}
          {currentView === 'books' && <Books show={true} />}
          {currentView === 'newBook' && <NewBook show={true} token={token} />}
        </>
      )}
    </div>
  )
}

export default App
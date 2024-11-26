import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import Books from './Books'
import 'bootstrap/dist/css/bootstrap.min.css'

const LoginForm = ({ setError, setToken, token }) => {
  const [username, setUsername] = useState('mluukkai')
  const [password, setPassword] = useState('secret')


  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })


  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('phonenumbers-user-token', token)
      console.log('Token: ',token)
    }
  }, [result.data, setToken])

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
   
  }

  return (
    <div className="container">
      <form onSubmit={submit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <Books show={true} />
    </div>
  )
}

export default LoginForm
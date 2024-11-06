import { useState } from 'react'

import {
  BrowserRouter as Router,
  Routes, Route, Link,
useNavigate,useParams

} from 'react-router-dom'

import useField from './hooks/index.js'

const Menu = ({user}) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>Anecdotes</Link>
      <Link to='/create'style={padding}>Create new</Link>
      <Link to='/about' style={padding}>About</Link>
      {user
        ? <em>{user} Logged in</em>
        : <Link to='/login' style={padding}>Login</Link>
      }
    </div>
  )
}

const Anecdote = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => a.id === Number(id))


  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>For more info, see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)



const Footer = () => (
  <div style={{ marginTop: '20px'}}> 
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = ({ addNew, setNotification }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()
 

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    
    setNotification(`A new anecdote "${content.value}" created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)

    navigate('/')
  
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }


  return (
    <div>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Content
          <input {...content.props} />
        </div>
        <div>
          Author
          <input {...author.props} />
        </div>
        <div>
          URL for more info
          <input {...info.props} />
        </div>
        <button type='submit'>Create</button>
      <button type='button' onClick={handleReset}>Reset</button>
      </form>
    </div>
  )
}

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    onLogin(username)
    navigate('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          Username:
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          Password:
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}


const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const handleLogin = (username) => {
    setUser(username)
  }


  const notificationStyle = {
    border: '2px solid black',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#007BFF',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
    color: 'white',
    width: '400px',
    maxWidth: '500px',
    margin: '0 auto'
  }


  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />

        {notification && <div style={notificationStyle}>{notification}</div>}
        <Routes>
          <Route path='/about' element={<About />} />
          <Route path='/create' element={<CreateNew addNew={addNew} setNotification={setNotification} />} />
          <Route path='/anecdotes/:id' element={<Anecdote anecdotes={anecdotes} />} />
          <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path='/login' element={<Login onLogin={handleLogin} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App

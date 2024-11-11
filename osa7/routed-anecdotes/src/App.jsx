import { useState } from 'react'

import {
  BrowserRouter as Router,
  Routes, Route, Link,
useNavigate,useParams

} from 'react-router-dom'

import useField from './hooks/index.js'
import { Table, Form, Button, Alert, Nav,Navbar } from 'react-bootstrap'

const Menu = ({user}) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link as="span">
          <Link style={padding} to="/">Anecdotes</Link>
        </Nav.Link>
        <Nav.Link as="span">
          <Link style={padding} to="/create">Create new</Link>
        </Nav.Link>
        <Nav.Link as="span">
          <Link style={padding} to="/about">About</Link>
        </Nav.Link>
        <Nav.Link as="span">
          {user ? (
            <em>{user} Logged in</em>
          ) : (
            <Link to="/login" style={padding}>Login</Link>
          )}
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)
}

const Anecdote = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => a.id === Number(id))


  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p style={{ textAlign: 'center' }}>has {anecdote.votes} votes</p>
      <p style={{ textAlign: 'center' }}>For more info, see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
  <h2>Anecdotes</h2>
  <Table striped>
    <tbody>
      {anecdotes.map(anecdote => (
        <tr key={anecdote.id}>
          <td>
            <Link to={`/anecdotes/${anecdote.id}`}>
              {anecdote.content}
            </Link>
          </td>
          <td>
            {anecdote.author}
          </td>
          <td>
            {anecdote.votes}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
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
    <div className="container">
      <h2>Create a new anecdote</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control {...content.props} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control {...author.props} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL for more info</Form.Label>
          <Form.Control {...info.props} />
        </Form.Group>

        <Button variant="primary" type="submit" className="me-2">
          Create
        </Button>
        <Button variant="secondary" type="button" onClick={handleReset}>
          Reset
        </Button>
      </Form>
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
      <h2>login</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
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

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const login = (user) => {
    setUser(user)
    setMessage(`Welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
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
    <div className="container">
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
            {(message &&
        <Alert variant="success">
          {message}
        </Alert>)}
        {notification && <div style={notificationStyle}>{notification}</div>}
      
        <Routes>
          <Route path='/about' element={<About />} />
          <Route path='/create' element={<CreateNew addNew={addNew} setNotification={setNotification} />} />
          <Route path='/anecdotes/:id' element={<Anecdote anecdotes={anecdotes} />} />
          <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path='/login' element={<Login onLogin={login} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </div>
  )
}


export default App

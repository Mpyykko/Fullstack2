import { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author
      published
      genres
    }
  }
`
const GET_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`
const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: GET_BOOKS },
      { query: GET_AUTHORS },
    ]
  })



  if (!props.show) {
    return null
  }

 
  const submit = async (event) => {
    event.preventDefault()
    addBook({
        variables: {
          title,
          author,
          published: parseInt(published),
          genres,
        }
      })

    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div className="container mt-4" >
      <form onSubmit={submit}>
        <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
          </label>
          <input
            id="title"
            value={title}
            className="form-control"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="mb-3">
          Author
          <input
            value={author}
            id="author"
            className="form-control"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className="mb-3">
          Published
          <input
            type="number"
            id="published"
            className="form-control"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div className="d-flex">
        <button type="button" className="btn btn-outline-primary ms-2"
            style={{ width: '100px' }}
            onClick={addGenre}> Add genre</button>
            <input
              type="text"
              id="genre"
              className="form-control"
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />  
          </div>
        <div>Genres: {genres.join(' ')}</div>
        <button type="submit" className="btn btn-success">Create book</button>
      </form>
    </div>
  )
}

export default NewBook
import { useState } from 'react'
import { useMutation, gql } from '@apollo/client'

import 'bootstrap/dist/css/bootstrap.min.css'

import { ADD_BOOK, GET_BOOKS, GET_AUTHORS} from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('phonenumbers-user-token')}`,
      },
    },
    refetchQueries: [
      { query: GET_BOOKS },
      { query: GET_AUTHORS },
    ],
    onError: (error) => {
      console.error('Error adding book:', error.message)
    },
  })


  if (!props.show) {
    return null
  }

 
  const submit = async (event) => {
    event.preventDefault()
    if (!title || !author || !published || genres.length === 0) {
      console.error('All fields are required!')
      return
    }
  
    const token = localStorage.getItem('phonenumbers-user-token')
    if (!token) {
      console.error('No token found!')
      return
    }
  
    console.log('Using token:', token)

    try {
      await addBook({
        variables: {
          title,
          author,
          published: parseInt(published),
          genres,
        }
      })
      console.log('add book...')
    } catch (error) {
      console.error('Error adding book:', error)
    }

    

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
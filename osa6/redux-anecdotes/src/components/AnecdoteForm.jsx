import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import { useRef } from 'react'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const anecdoteInputRef = useRef()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = anecdoteInputRef.current.value
    anecdoteInputRef.current.value = ''
    
    dispatch(createAnecdote({
      content,
      id: getId(),
      votes: 0
    }))
    console.log('Nyt pitäisi tulla ilmoitus')
    dispatch(setNotification(`You added "${content}"`))
    setTimeout(() => {
      console.log('Nyt ilmoitus poistuu')
      dispatch(clearNotification())
    }, 5000)
  }

  const getId = () => (100000 * Math.random()).toFixed(0)

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input ref={anecdoteInputRef} /></div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

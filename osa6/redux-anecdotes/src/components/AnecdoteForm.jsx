import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'
import { useRef } from 'react'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const anecdoteInputRef = useRef()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = anecdoteInputRef.current.value
    anecdoteInputRef.current.value = ''
    
    dispatch(createAnecdote(content))
    dispatch(notify(`You added "${content}"`, 5))
  }

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

import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdoteAndUpdate } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filter = useSelector(state => state.filter || '')
  const anecdotes = useSelector(state => state.anecdotes || [])

  const filteredAnecdotes = anecdotes
    .filter(anecdote => {
      if (typeof anecdote.content === 'string') {
        return anecdote.content.toLowerCase().includes(filter.toLowerCase())
      }
      return false
    })
    .sort((a, b) => b.votes - a.votes)

  const vote = (id) => {
    dispatch(voteAnecdoteAndUpdate(id))
  }

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList

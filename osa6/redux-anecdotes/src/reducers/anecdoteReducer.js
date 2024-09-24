import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes + 1 
      }
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    },
  },
})

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create({ content, votes: 0 })
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdoteAndUpdate = (id) => {
  return async (dispatch, getState) => {
    const anecdoteToVote = getState().anecdotes.find(a => a.id === id)
    const updatedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
    
    await anecdoteService.updateVotes(updatedAnecdote)
    dispatch(voteAnecdote(id))
  }
}

export const { appendAnecdote, setAnecdotes, voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer

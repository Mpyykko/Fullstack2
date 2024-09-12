import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const good = () => {
    store.dispatch({
      type: 'GOOD'
    })
  }

  const bad = () => {
    store.dispatch({
      type: 'BAD'

      
    })
  }

  const ok = () => {
    store.dispatch({
      type: 'OK'
    }) 
  }

  const reset = () => {
    store.dispatch({
      type: 'RESET'
    }) 
  }

  return (
    <div>
      <button onClick={good}>Good</button> 
      <button onClick={ok}>Ok</button> 
      <button onClick={bad}>Bad</button> 
      <button onClick={reset}>Reset</button> 
      <div>Good {store.getState().good}</div>
      <div>Ok {store.getState().ok}</div>
      <div>Bad {store.getState().bad}</div>

    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)

import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [aanet, setAanet] = useState(Array(anecdotes.length).fill(0))
  const [enitenAania, setenitenAania] = useState(0);

  const arvoAnekdootti = () => {
    let randomi = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomi)
  }



  const aanestys = () => {
    
    let uudetAanet = [...aanet]
    console.log(uudetAanet)
    uudetAanet[selected] += 1
    setAanet(uudetAanet)
    if (uudetAanet[selected] > uudetAanet[enitenAania]) {
      setenitenAania(selected);
    }
  }

  return (
    <div>
      <h3>Satunnaisia anekdootteja</h3>
      {anecdotes[selected]} <br/> <br/>
      
      < button onClick= {arvoAnekdootti}>Arvo anekdootti </button>
      < button onClick= {aanestys}>Äänestä tätä </button>
      <p>Tällä anekdootilla on {aanet[selected]} ääntä</p>
      <h4>Eniten ääniä saanut anekdootti:</h4>
      <p>{anecdotes[enitenAania]}</p>
      <p>Ääniä {aanet[enitenAania]}</p>


    </div>
  )
}

export default App
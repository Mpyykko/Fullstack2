import { useState } from 'react'

const Statistics = (props) => {
  if (props.yhteensa <1){
    
    return <h5>Ei annettuja palautteita</h5>
  }
  return(
    <div>
      <h2> Palautteet </h2>
      <table>
        <tbody>
          < Statisticline text='Hyvä' value={props.hyva} />
          < Statisticline text='Neutraali' value={props.neutraali} />
          < Statisticline text='Huono' value={props.huono} />
          < Statisticline text='Yhteensä' value={props.yhteensa} />
          < Statisticline text='Keskiarvo' value={props.keskiarvo.toFixed(2)} />
          < Statisticline text='Positiivisia' value={props.positiiviset.toFixed(2)} />
        </tbody>
      </table>

    </div>
  )

}

const Button = ({onClick, text}) => {
  return < button onClick={onClick}>{text} </button>
}

const Statisticline = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}



const App = () => {

  const [hyva, setGood] = useState(0)
  const [neutraali, setNeutral] = useState(0)
  const [huono, setBad] = useState(0)


  // yhteensä
  const yhteensa = hyva + neutraali + huono

  // keskiarvo
  const keskiarvo = yhteensa / 3

  // positiiviset
  const positiiviset = hyva / yhteensa * 100



  return (
    <>
      <h2>Anna palautetta</h2>
      <Button onClick={() => setGood(hyva + 1)} text = 'Hyvä'/>
      <Button onClick={() => setNeutral(neutraali + 1)} text = 'Neutraali'/>
      <Button onClick={() => setBad(huono + 1)} text = 'Huono'/>
      < Statistics hyva={hyva} neutraali={neutraali} huono={huono} yhteensa={yhteensa} keskiarvo={keskiarvo} positiiviset={positiiviset} />
    </>
  )
}



export default App
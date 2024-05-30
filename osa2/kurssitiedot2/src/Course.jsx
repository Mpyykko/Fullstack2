

const Header = (props) => {
    console.log(props)
    return (
      <div>
        <h1> {props.course} </h1>
      </div>
    )
  }
  
  // apukomponentti
  const Part = (props) => {
  
    return (
      <p> {props.part} {props.exercises} </p>
    )
  }
  
  const Content = (props) =>{
    const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
    
    return (
        
        <div>
        {props.parts.map((part) => (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        
        ))}
        <h4>Total of {total} exercises</h4>
      </div>
      
    )
  }



  const Course = (props) =>{
    return (
      <div>
        <Header course = {props.course.name} />
        <Content parts = {props.course.parts} />
      </div>
    )

  }


  export default Course
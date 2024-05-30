import Course from './Course';





const App = () => {

  const courses = [
  {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  },
  {
    name: 'Toinen kurssi',
    id: 2,
    parts: [
      {
        name: 'Toinen eka',
        exercises: 5,
        id: 1,
      },
      {
        name: 'Toinen toka',
        exercises: 10,
        id: 2,
      },
      {
        name: 'Toinen kolmas',
        exercises: 15,
        id: 3,
      }
    ]
  }



]

  return (
    <div>
    
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  )
}

export default App

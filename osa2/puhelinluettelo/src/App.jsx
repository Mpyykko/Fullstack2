import React, { useState } from 'react'


const Filter=({filter, handleFilterChange}) => {
  return (
    <div>
      Filter shown with <input value={filter} onChange={handleFilterChange} />

    </div>
  )
}



const PersonForm=({newName, handleNameChange, newNumber, handleNumberChange, addPerson}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const Persons=({persons}) => {
  return (
    <ul>
      { persons.map((person, index) => (
        <Person key={index} person={person} />
      ))
      }
    </ul>
  )
}

const Person=({person}) => {
  return (
    <li>{person.name} {person.number}</li>
  )

}



const App=() => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')


  // käsittele nimi
  const handleNameChange = (event) => {

    setNewName(event.target.value)
  }

  // käsittele numero
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  // filtteri
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };




  const addPerson = (event) => {
    event.preventDefault()

  console.log(persons)

    // onko jo olemassa
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} on jo luettelossa!`)

      setNewName('')
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add new person</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App

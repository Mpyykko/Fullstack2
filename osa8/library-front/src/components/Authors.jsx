import { useQuery, gql } from '@apollo/client'
import { useMutation} from '@apollo/client'
import { useState } from 'react'
import Select from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css'

const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`
const Authors = (props) => {
    const { loading, error, data } = useQuery(GET_AUTHORS)
    const [editAuthor] = useMutation(EDIT_AUTHOR)

    const [editingAuthor, setEditingAuthor] = useState(null)
    const [newBorn, setNewBorn] = useState('')
    const [selectedAuthor, setSelectedAuthor] = useState(null)
  
    if (!props.show) {
      return null
    }
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>
  
    const authors = data.allAuthors

    const authorOptions = authors.map((author) => ({
        value: author.name,
        label: author.name,
      }))

    const handleCancel = () => {
        setEditingAuthor(null)
        setSelectedAuthor(null)
        setNewBorn('')
    }    

    const handleEditClick = (author) => {
        setEditingAuthor(author)
        setNewBorn(author.born || '')
        setSelectedAuthor({ value: author.name, label: author.name })
      }
      const handleUpdate = async (event) => {
        event.preventDefault()
    
        if (!selectedAuthor) {
          return
        }
    
        await editAuthor({
          variables: {
            name: selectedAuthor.value,
            setBornTo: parseInt(newBorn),
          },
          refetchQueries: [{ query: GET_AUTHORS }],
        })
        setEditingAuthor(null)
        setNewBorn('')
        setSelectedAuthor(null)

       
      }
      
  
      return (
        <div className="container mt-4">
          <h2>Authors</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Born</th>
                <th>Books</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.born}</td>
                  <td>{a.bookCount}</td>
                  <td>
                    <button onClick={() => handleEditClick(a)} className="btn btn-primary">
                      Edit Birth Year
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingAuthor && (
            <div className="mt-4">
              <h3>Update Birth Year</h3>
              <form onSubmit={handleUpdate} className="form">
                <div className="mb-3">
                  <Select
                    value={selectedAuthor}
                    onChange={setSelectedAuthor}
                    options={authorOptions}
                    className="form-control"
                    placeholder="Select author"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    value={newBorn}
                    onChange={({ target }) => setNewBorn(target.value)}
                    placeholder="Enter birth year"
                    className="form-control"
                  />
                </div>
                <div>
                  <button type="submit" className="btn btn-success">
                    Update
                  </button>
                  <button type="button"   className="btn btn-secondary ms-2"
                    onClick={handleCancel}> Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )
    }
    
    export default Authors
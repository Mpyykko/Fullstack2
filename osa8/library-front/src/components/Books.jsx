import { useQuery, gql } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'


const GET_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`

const Books = (props) => {
  const { loading, error, data } = useQuery(GET_BOOKS)

  if (!props.show) {
    return null
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const books = data.allBooks
  
    return (
      <div className="container mt-4" >
        <h2>Books</h2>
  
        <table className="table table-striped">
          <tbody>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
            {books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default Books
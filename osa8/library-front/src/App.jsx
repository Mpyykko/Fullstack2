import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [page, setPage] = useState("authors");

  return (
    <div className="container mt-4">
      <div className="btn-group" role="group" aria-label="Basic example" >
        <button className="btn btn-outline-primary" onClick={() => setPage("authors") }>authors</button>
        <button className="btn btn-outline-primary" onClick={() => setPage("books")}>books</button>
        <button className="btn btn-outline-primary" onClick={() => setPage("add")}>add book</button>
      </div>
      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
      <div className="App container mt-5">
        <BookStatisticsButton/>
        <SearchBookByPreference/>
        <SearchBookByDescription/>
      </div>
  );
}

function BookStatisticsButton() {
  return (
      <div className="my-3">
        <button className="btn btn-warning w-100">Book Statistics</button>
      </div>
  )
}

function SearchBookByPreference() {
  return (
      <div className="my-4">
        <h1 className="text-dark">Search for a book from a book you liked</h1>
        <div className="d-flex flex-wrap justify-content-center">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn btn-warning my-2" type="submit">Search</button>
        </div>
      </div>
  )
}

function SearchBookByDescription() {
  return (
      <div className="my-4">
        <h1 className="text-dark">Search for a book by description</h1>
        <div className="d-flex flex-wrap justify-content-center">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn btn-warning my-2" type="submit">Search</button>
        </div>
      </div>
  )
}



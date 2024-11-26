import 'bootstrap/dist/css/bootstrap.min.css';

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div className="alert alert-danger" role="alert">
      {errorMessage}
    </div>
  )
}

export default Notify
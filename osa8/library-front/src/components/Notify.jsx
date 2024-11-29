import 'bootstrap/dist/css/bootstrap.min.css';

const Notify = ({ message, type }) => {
  if (!message) {
    return null;
  }
  return (
    <div
      className={`alert ${type === 'error' ? 'alert-danger' : 'alert-success'}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Notify;

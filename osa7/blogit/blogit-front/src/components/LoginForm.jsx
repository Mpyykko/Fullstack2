import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div
      className="p-4 border rounded"
      style={{ maxWidth: '400px', margin: 'auto' }}
    >
      <h2 className="mb-4 text-center">Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            data-testid="username"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            data-testid="password"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};
LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};
export default LoginForm;

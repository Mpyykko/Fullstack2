import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetched user ID:', id);
    if (id) {
      const fetchUser = async () => {
        try {
          console.log(`Attempting to fetch user from: /api/users/${id}`);
          const response = await axios.get(`/api/users/${id}`);
          setUser(response.data);
        } catch (error) {
          console.error(
            'Error details:',
            error.response ? error.response.data : error.message
          );
          setError('Käyttäjän tietoja ei voitu hakea.');
        }
      };

      fetchUser();
    } else {
      console.error('ID puuttuu URL:sta.');
      setError('Käyttäjän tunnus puuttuu.');
    }
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="container mt-4">
      <div
        className="card shadow-sm"
        style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}
      >
        <div className="card-body">
          <h3 className="card-title text-primary">
            {user.name} has{' '}
            <span className="badge bg-success">{user.blogs.length}</span> blogs
          </h3>
          {user.blogs.length > 0 ? (
            <ul className="list-group list-group-flush">
              {user.blogs.map((blog) => (
                <li
                  key={blog.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ borderBottom: '1px solid #dee2e6' }}
                >
                  <div>
                    <strong>{blog.title}</strong>{' '}
                    <em className="text-muted">by {blog.author}</em>
                  </div>
                  <span className="badge bg-warning text-dark">
                    Likes: {blog.likes}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted mt-3">User has no blogs.</p>
          )}
          <button
            className="btn btn-secondary mt-4"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

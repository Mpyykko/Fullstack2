import React, { useEffect, useState } from 'react';
import userService from '../services/users';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getUserById(id);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div className="container mt-4">
      <h2>{user.name}</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Blogs created:</strong> {user.blogCount}</p>
      
      <h3>Blogs</h3>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Likes</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {user.blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{blog.author}</td>
              <td>{blog.likes}</td>
              <td><a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetail;

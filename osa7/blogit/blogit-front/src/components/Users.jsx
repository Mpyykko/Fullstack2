import React, { useEffect, useState } from 'react';
import userService from '../services/users';
import 'bootstrap/dist/css/bootstrap.min.css';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await userService.getAll();
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Users</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Blogs</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.blogCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;

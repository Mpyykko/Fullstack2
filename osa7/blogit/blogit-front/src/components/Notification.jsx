import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification) {
    return null;
  }

  const { message, type } = notification;
  const notificationStyle = {
    padding: '10px',
    marginBottom: '10px',
    fontSize: '20px',
    borderRadius: '5px',
    backgroundColor: type === 'success' ? 'lightgreen' : 'lightcoral',
    border: '1px solid black',
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;

import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ notification }) => {
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
Notification.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error']).isRequired,
  }),
};
export default Notification;

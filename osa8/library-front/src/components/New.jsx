import React from 'react';
import { useSubscription } from '@apollo/client';
import { BOOK_ADDED } from '../queries';

const New = () => {
  const { data, loading, error } = useSubscription(BOOK_ADDED);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (data && data.bookAdded) {
    const { title, author, published } = data.bookAdded;
    window.alert(
      `New book added: "${title}" by ${author.name}, published in ${published}`
    );
  }

  return null;
};

export default New;

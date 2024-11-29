import { useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { BOOK_ADDED } from '../queries';

const Subscription = ({ setBooks }) => {
  const { data, loading, error } = useSubscription(BOOK_ADDED);

  useEffect(() => {
    if (data) {
      setBooks((prevBooks) => [...prevBooks, data.bookAdded]);
    }
  }, [data, setBooks]);

  if (loading) return <div>Loading new books...</div>;
  if (error) return <div>No added books yet</div>;

  return null;
};

export default Subscription;

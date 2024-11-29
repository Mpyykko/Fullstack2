import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const ME_QUERY = gql`
  query {
    me {
      username
      favoriteGenre {
        name
      }
    }
  }
`;

const UserFavoriteGenre = () => {
  const { data, loading, error } = useQuery(ME_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log('GraphQL data:', data);
  if (!data || !data.me) {
    return <p>Error: User data not found</p>;
  }

  const { username, favoriteGenre } = data.me;

  return (
    <div>
      <p>
        Your favorite genre:{' '}
        {favoriteGenre ? favoriteGenre.name : 'None selected'}
      </p>
    </div>
  );
};

export default UserFavoriteGenre;

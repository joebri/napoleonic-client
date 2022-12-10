import gql from 'graphql-tag';

export default gql`
  query readArtistCounts {
    readArtistCounts {
      name
      count
    }
  }
`;

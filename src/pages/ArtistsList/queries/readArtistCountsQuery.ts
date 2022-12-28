import gql from 'graphql-tag';

export default gql`
  query readArtistCounts($tags: [String!]!) {
    readArtistCounts(input: { tags: $tags }) {
      name
      count
    }
  }
`;

import gql from 'graphql-tag';

export default gql`
  query readArtistCounts($ratings: [Int!]!, $tags: [String!]!) {
    readArtistCounts(input: { ratings: $ratings, tags: $tags }) {
      name
      count
    }
  }
`;

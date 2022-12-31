import gql from 'graphql-tag';

export default gql`
  query readRegimentCounts($ratings: [Int!]!, $tags: [String!]!) {
    readRegimentCounts(input: { ratings: $ratings, tags: $tags }) {
      name
      count
    }
  }
`;

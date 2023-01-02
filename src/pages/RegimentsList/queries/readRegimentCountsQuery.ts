import gql from 'graphql-tag';

export default gql`
  query readRegimentCounts(
    $ratings: [Int!]!
    $tags: [String!]!
    $yearRange: [Int!]!
    $includeUnknownYear: Boolean!
  ) {
    readRegimentCounts(
      input: {
        ratings: $ratings
        tags: $tags
        yearRange: $yearRange
        includeUnknownYear: $includeUnknownYear
      }
    ) {
      name
      count
    }
  }
`;

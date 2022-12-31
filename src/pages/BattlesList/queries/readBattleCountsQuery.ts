import gql from 'graphql-tag';

export default gql`
  query readBattleCounts($ratings: [Int!]!, $tags: [String!]!) {
    readBattleCounts(input: { ratings: $ratings, tags: $tags }) {
      name
      count
    }
  }
`;

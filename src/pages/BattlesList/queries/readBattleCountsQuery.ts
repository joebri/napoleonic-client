import gql from 'graphql-tag';

export default gql`
  query readBattleCounts($ratings: [Int!]!) {
    readBattleCounts(input: { ratings: $ratings }) {
      name
      count
    }
  }
`;

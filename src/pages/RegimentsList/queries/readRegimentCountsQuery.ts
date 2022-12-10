import gql from 'graphql-tag';

export default gql`
  query readRegimentCounts($tags: [String!]!) {
    readRegimentCounts(input: { tags: $tags }) {
      name
      count
    }
  }
`;

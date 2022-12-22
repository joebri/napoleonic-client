import gql from 'graphql-tag';

export default gql`
  query readBattleCounts {
    readBattleCounts {
      name
      count
    }
  }
`;

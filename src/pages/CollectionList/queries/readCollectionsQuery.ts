import gql from 'graphql-tag';

export default gql`
  query readCollections {
    readCollections {
      group
      name
      itemId
    }
  }
`;
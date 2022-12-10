import gql from 'graphql-tag';

export default gql`
  query ReadCollections {
    readCollections {
      name
      uri
    }
  }
`;

import gql from 'graphql-tag';

export default gql`
  mutation deleteCollection($id: ID!) {
    deleteCollection(id: $id)
  }
`;

import gql from 'graphql-tag';

const deleteCollectionMutation = gql`
  mutation deleteCollection($id: ID!) {
    deleteCollection(id: $id)
  }
`;

export { deleteCollectionMutation };

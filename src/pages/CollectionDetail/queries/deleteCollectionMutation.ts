import gql from 'graphql-tag';

export const deleteCollectionMutation = gql`
    mutation deleteCollection($id: ID!) {
        deleteCollection(id: $id)
    }
`;

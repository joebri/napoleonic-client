import gql from 'graphql-tag';

const deleteItemMutation = gql`
    mutation deleteItem($id: ID!) {
        deleteItem(id: $id)
    }
`;

export { deleteItemMutation };

import { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';

export type DeleteItemResponse = {
    deleteItem: {
        id: number;
    };
};

export type DeleteItemVariables = {};

export const deleteItemMutation: TypedDocumentNode<
    DeleteItemResponse,
    DeleteItemVariables
> = gql`
    mutation deleteItem($id: ID!) {
        deleteItem(id: $id)
    }
`;

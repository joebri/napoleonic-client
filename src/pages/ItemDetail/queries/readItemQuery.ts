import { TypedDocumentNode } from '@apollo/client';
import { Item } from '@models/Item.model';
import gql from 'graphql-tag';

export type ReadItemResponse = {
    readItem: Item;
};

export type ReadItemVariables = {
    id: string;
};

export const readItemQuery: TypedDocumentNode<
    ReadItemResponse,
    ReadItemVariables
> = gql`
    query readItem($id: ID!) {
        readItem(id: $id) {
            artist
            descriptionLong
            descriptionShort
            id
            publicId
            rating
            regiments
            tags
            title
            yearFrom
            yearTo
        }
    }
`;

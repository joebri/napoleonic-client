import { TypedDocumentNode } from '@apollo/client';
import { Collection } from '@models/Collection.model';
import gql from 'graphql-tag';

export type ReadCollectionResponse = {
    readCollection: Collection;
};

export type ReadCollectionVariables = {
    id: string;
};

export const readCollectionQuery: TypedDocumentNode<
    ReadCollectionResponse,
    ReadCollectionVariables
> = gql`
    query readCollection($id: ID!) {
        readCollection(id: $id) {
            descriptionLong
            descriptionShort
            id
            tagName
            title
        }
    }
`;

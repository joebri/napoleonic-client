import { TypedDocumentNode } from '@apollo/client';
import { Collection } from '@models/Collection.model';
import gql from 'graphql-tag';

export type ReadCollectionsResponse = {
    readCollections: Collection[];
};

export type ReadCollectionsVariables = {};

export const readCollectionsQuery: TypedDocumentNode<
    ReadCollectionsResponse,
    ReadCollectionsVariables
> = gql`
    query readCollections {
        readCollections {
            descriptionLong
            descriptionShort
            id
            tagName
            title
        }
    }
`;

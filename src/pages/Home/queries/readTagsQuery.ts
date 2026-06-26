import { TypedDocumentNode } from '@apollo/client';
import { Tag } from '@models/Tag.model';
import gql from 'graphql-tag';

export type ReadTagsResponse = {
    readTags: Tag[];
};

export type ReadTagsVariables = {};

export const readTagsQuery: TypedDocumentNode<
    ReadTagsResponse,
    ReadTagsVariables
> = gql`
    query readTags {
        readTags {
            group
            name
            itemId
        }
    }
`;

import { TypedDocumentNode } from '@apollo/client';
import { FilterTag } from '@models/FilterTag.model';
import gql from 'graphql-tag';

export type ReadTagsResponse = {
    readTags: FilterTag[];
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

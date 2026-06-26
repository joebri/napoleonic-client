import { TypedDocumentNode } from '@apollo/client';
import { ItemTag } from '@models/ItemTag.model';
import gql from 'graphql-tag';

export const readItemTagCountsQuery: TypedDocumentNode<
    { readItemTagCounts: ItemTag[] },
    {}
> = gql`
    query readItemTagCounts {
        readItemTagCounts {
            name
            count
        }
    }
`;

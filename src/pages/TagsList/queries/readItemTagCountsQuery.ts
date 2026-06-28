import { TypedDocumentNode } from '@apollo/client';
import { TagCount } from '@models/TagCount.model';
import gql from 'graphql-tag';

export const readItemTagCountsQuery: TypedDocumentNode<
    { readItemTagCounts: TagCount[] },
    {}
> = gql`
    query readItemTagCounts {
        readItemTagCounts {
            name
            count
        }
    }
`;

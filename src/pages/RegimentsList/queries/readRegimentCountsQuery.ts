import { TypedDocumentNode } from '@apollo/client';
import { TagCount as RegimentCount } from '@models/TagCount.model';
import gql from 'graphql-tag';

export type ReadRegimentCountsResponse = {
    readRegimentCounts: RegimentCount[];
};

export type ReadRegimentCountsVariables = {
    ratings: number[];
    tags: string[];
    yearRange: number[];
    includeUnknownYear: boolean;
};

export const readRegimentCountsQuery: TypedDocumentNode<
    ReadRegimentCountsResponse,
    ReadRegimentCountsVariables
> = gql`
    query readRegimentCounts(
        $ratings: [Int!]!
        $tags: [String!]!
        $yearRange: [Int!]!
        $includeUnknownYear: Boolean!
    ) {
        readRegimentCounts(
            input: {
                ratings: $ratings
                tags: $tags
                yearRange: $yearRange
                includeUnknownYear: $includeUnknownYear
            }
        ) {
            name
            count
        }
    }
`;

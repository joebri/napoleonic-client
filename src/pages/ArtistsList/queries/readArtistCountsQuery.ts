import { TypedDocumentNode } from '@apollo/client';
import { ArtistCount } from '@models/ArtistCount.model';
import gql from 'graphql-tag';

export type ReadArtistCountsResponse = {
    readArtistCounts: ArtistCount[];
};

export type ReadArtistCountsVariables = {
    ratings: number[];
    tags: string[];
    yearRange: number[];
    includeUnknownYear: boolean;
};

export const readArtistCountsQuery: TypedDocumentNode<
    ReadArtistCountsResponse,
    ReadArtistCountsVariables
> = gql`
    query readArtistCounts(
        $ratings: [Int!]!
        $tags: [String!]!
        $yearRange: [Int!]!
        $includeUnknownYear: Boolean!
    ) {
        readArtistCounts(
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

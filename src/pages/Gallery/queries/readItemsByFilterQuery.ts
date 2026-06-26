import { TypedDocumentNode } from '@apollo/client';
import { Item } from '@models/Item.model';
import gql from 'graphql-tag';

export type ReadItemsByFilterResponse = {
    readItemsByFilter: {
        count: number;
        items: Item[];
    };
};

export type ReadItemsByFilterVariables = {
    artists: string[];
    battles: string[];
    pageNumber: number;
    pageSize: number;
    ratings: number[];
    regiments: string[];
    sort: string;
    sortSequence: string;
    tags: string[];
    yearRange: number[];
    includeUnknownYear: boolean;
};

export const readItemsByFilterQuery: TypedDocumentNode<
    ReadItemsByFilterResponse,
    ReadItemsByFilterVariables
> = gql`
    query readItemsByFilter(
        $artists: [String!]
        $battles: [String!]
        $pageNumber: Int!
        $pageSize: Int!
        $ratings: [Int!]
        $regiments: [String!]
        $sort: String!
        $sortSequence: String!
        $tags: [String!]!
        $yearRange: [Int!]!
        $includeUnknownYear: Boolean!
    ) {
        readItemsByFilter(
            input: {
                artists: $artists
                battles: $battles
                pageNumber: $pageNumber
                pageSize: $pageSize
                ratings: $ratings
                regiments: $regiments
                tags: $tags
                sort: $sort
                sortSequence: $sortSequence
                yearRange: $yearRange
                includeUnknownYear: $includeUnknownYear
            }
        ) {
            count
            items {
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
    }
`;

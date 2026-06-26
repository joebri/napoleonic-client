import { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';

export type CreateItemResponse = {
    createItem: string;
};

export type CreateItemVariables = {
    artist: string;
    descriptionLong: string;
    descriptionShort: string;
    publicId: string;
    rating: number;
    regiments: string;
    tags: string[];
    title: string;
    yearFrom: string;
    yearTo: string;
};

export const createItemMutation: TypedDocumentNode<
    CreateItemResponse,
    CreateItemVariables
> = gql`
    mutation createItem(
        $artist: String!
        $descriptionLong: String!
        $descriptionShort: String!
        $publicId: String!
        $rating: Int!
        $regiments: String!
        $tags: [String!]!
        $title: String!
        $yearFrom: String!
        $yearTo: String!
    ) {
        createItem(
            input: {
                artist: $artist
                descriptionLong: $descriptionLong
                descriptionShort: $descriptionShort
                publicId: $publicId
                rating: $rating
                regiments: $regiments
                tags: $tags
                title: $title
                yearFrom: $yearFrom
                yearTo: $yearTo
            }
        )
    }
`;

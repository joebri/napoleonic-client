import { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';

export type CreateCollectionResponse = {
    createCollectionV2: string;
};

export type CreateCollectionVariables = {
    descriptionLong: string;
    descriptionShort: string;
    tagName: string;
    title: string;
};

export const createCollectionMutation: TypedDocumentNode<
    CreateCollectionResponse,
    CreateCollectionVariables
> = gql`
    mutation createCollection(
        $descriptionLong: String!
        $descriptionShort: String!
        $tagName: String!
        $title: String!
    ) {
        createCollectionV2(
            input: {
                descriptionLong: $descriptionLong
                descriptionShort: $descriptionShort
                tagName: $tagName
                title: $title
            }
        )
    }
`;

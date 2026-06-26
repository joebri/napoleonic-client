import gql from 'graphql-tag';

export const updateCollectionMutation = gql`
    mutation updateCollection(
        $descriptionLong: String!
        $descriptionShort: String!
        $id: ID!
        $tagName: String!
        $title: String!
    ) {
        updateCollectionV2(
            input: {
                descriptionLong: $descriptionLong
                descriptionShort: $descriptionShort
                id: $id
                tagName: $tagName
                title: $title
            }
        )
    }
`;

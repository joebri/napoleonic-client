import gql from 'graphql-tag';

const createCollectionMutation = gql`
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

export { createCollectionMutation };

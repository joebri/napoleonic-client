import gql from 'graphql-tag';

const readCollectionQuery = gql`
    query readCollection($id: ID!) {
        readCollection(id: $id) {
            descriptionLong
            descriptionShort
            id
            tagName
            title
        }
    }
`;

export { readCollectionQuery };

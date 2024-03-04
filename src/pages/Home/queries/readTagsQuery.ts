import gql from 'graphql-tag';

const readTagsQuery = gql`
    query readTags {
        readTags {
            group
            name
            itemId
        }
    }
`;

export { readTagsQuery };

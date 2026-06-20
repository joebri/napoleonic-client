import gql from 'graphql-tag';

export const readItemTagCountsQuery = gql`
    query readItemTagCounts {
        readItemTagCounts {
            name
            count
        }
    }
`;

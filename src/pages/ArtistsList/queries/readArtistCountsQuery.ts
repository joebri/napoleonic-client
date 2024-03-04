import gql from 'graphql-tag';

const readArtistCountsQuery = gql`
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

export { readArtistCountsQuery };

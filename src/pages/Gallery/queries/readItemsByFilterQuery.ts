import gql from 'graphql-tag';

const readItemsByFilterQuery = gql`
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

export { readItemsByFilterQuery };

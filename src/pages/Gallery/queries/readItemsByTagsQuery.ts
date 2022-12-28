import gql from 'graphql-tag';

export default gql`
  query readItemsByTags(
    $artists: [String!]
    $battles: [String!]
    $pageNumber: Int!
    $pageSize: Int!
    $ratings: [Int!]
    $regiments: [String!]
    $sort: String!
    $sortSequence: String!
    $tags: [String!]!
  ) {
    readItemsByTags(
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
      }
    ) {
      count
      items {
        artist
        descriptionLong
        descriptionShort
        id
        isCollection
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

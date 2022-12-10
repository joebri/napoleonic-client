import gql from 'graphql-tag';

export default gql`
  query readItemsByTags(
    $artists: [String!]
    $pageNumber: Int!
    $pageSize: Int!
    $regiments: [String!]
    $sort: String!
    $sortSequence: String!
    $tags: [String!]!
  ) {
    readItemsByTags(
      input: {
        artists: $artists
        pageNumber: $pageNumber
        pageSize: $pageSize
        regiments: $regiments
        tags: $tags
        sort: $sort
        sortSequence: $sortSequence
      }
    ) {
      count
      items {
        artist {
          name
        }
        contentId
        descriptionLong
        descriptionShort
        id
        publicId
        regiment
        regiments
        tags
        title
        yearFrom
        yearTo
      }
    }
  }
`;

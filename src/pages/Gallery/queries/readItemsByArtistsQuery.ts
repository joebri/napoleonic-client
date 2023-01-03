import gql from 'graphql-tag';

export default gql`
  query readItemsByArtists(
    $artists: [String!]!
    $pageNumber: Int!
    $pageSize: Int!
  ) {
    readItemsByArtists(
      input: { artists: $artists, pageNumber: $pageNumber, pageSize: $pageSize }
    ) {
      count
      items {
        artist
        descriptionLong
        descriptionShort
        id
        publicId
        regiments
        tags
        title
        yearFrom
        yearTo
      }
    }
  }
`;

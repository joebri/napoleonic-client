import gql from 'graphql-tag';

export default gql`
  mutation createItem(
    $artist: String!
    $descriptionLong: String!
    $descriptionShort: String!
    $publicId: String!
    $rating: Int!
    $regiments: String!
    $tags: [String!]!
    $title: String!
    $yearFrom: String!
    $yearTo: String!
  ) {
    createItem(
      input: {
        artist: $artist
        descriptionLong: $descriptionLong
        descriptionShort: $descriptionShort
        publicId: $publicId
        rating: $rating
        regiments: $regiments
        tags: $tags
        title: $title
        yearFrom: $yearFrom
        yearTo: $yearTo
      }
    )
  }
`;

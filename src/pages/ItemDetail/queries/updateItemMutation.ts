import gql from 'graphql-tag';

const updateItemMutation = gql`
  mutation updateItem(
    $artist: String!
    $descriptionLong: String!
    $descriptionShort: String!
    $id: ID!
    $publicId: String!
    $rating: Int!
    $regiments: String!
    $tags: [String!]!
    $title: String!
    $yearFrom: String!
    $yearTo: String!
  ) {
    updateItem(
      input: {
        artist: $artist
        descriptionLong: $descriptionLong
        descriptionShort: $descriptionShort
        id: $id
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

export { updateItemMutation };

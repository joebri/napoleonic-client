import gql from 'graphql-tag';

export default gql`
  mutation updateItem(
    $artist: String
    $descriptionLong: String
    $descriptionShort: String
    $id: ID!
    $publicId: String
    $regiment: String
    $regiments: String
    $tags: [String]
    $title: String
    $yearFrom: String
    $yearTo: String
  ) {
    updateItem(
      input: {
        artist: { name: $artist }
        descriptionLong: $descriptionLong
        descriptionShort: $descriptionShort
        id: $id
        publicId: $publicId
        regiment: $regiment
        regiments: $regiments
        tags: $tags
        title: $title
        yearFrom: $yearFrom
        yearTo: $yearTo
      }
    )
  }
`;

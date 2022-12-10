import gql from 'graphql-tag';

export default gql`
  mutation createItem(
    $artist: String
    $descriptionLong: String
    $descriptionShort: String
    $publicId: String
    $regiments: String
    $tags: [String]
    $title: String
    $yearFrom: String
    $yearTo: String
  ) {
    createItem(
      input: {
        artist: { name: $artist }
        descriptionLong: $descriptionLong
        descriptionShort: $descriptionShort
        publicId: $publicId
        regiments: $regiments
        tags: $tags
        title: $title
        yearFrom: $yearFrom
        yearTo: $yearTo
      }
    )
  }
`;

import gql from 'graphql-tag';

export default gql`
  mutation updateItem(
    $descriptionLong: String
    $descriptionShort: String
    $id: ID!
    $tags: [String]
    $title: String
  ) {
    updateItem(
      input: {
        descriptionLong: $descriptionLong
        descriptionShort: $descriptionShort
        id: $id
        tags: $tags
        title: $title
      }
    )
  }
`;

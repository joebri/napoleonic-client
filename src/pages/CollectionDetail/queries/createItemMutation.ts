import gql from 'graphql-tag';

export default gql`
  mutation createItem(
    $descriptionLong: String
    $descriptionShort: String
    $tags: [String]
    $title: String
  ) {
    createItem(
      input: {
        descriptionLong: $descriptionLong
        descriptionShort: $descriptionShort
        isCollection: true
        tags: $tags
        title: $title
      }
    )
  }
`;

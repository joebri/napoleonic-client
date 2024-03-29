import gql from 'graphql-tag';

const createCollectionMutation = gql`
  mutation createCollection(
    $descriptionLong: String!
    $descriptionShort: String!
    $tagName: String!
    $tags: [String!]!
    $title: String!
  ) {
    createCollection(
      input: {
        descriptionLong: $descriptionLong
        descriptionShort: $descriptionShort
        tagName: $tagName
        tags: $tags
        title: $title
      }
    )
  }
`;

export { createCollectionMutation };

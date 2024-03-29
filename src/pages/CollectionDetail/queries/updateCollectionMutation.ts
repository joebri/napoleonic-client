import gql from 'graphql-tag';

const updateCollectionMutation = gql`
  mutation updateCollection(
    $descriptionLong: String!
    $descriptionShort: String!
    $id: ID!
    $tagName: String!
    $tags: [String!]!
    $title: String!
  ) {
    updateCollection(
      input: {
        descriptionLong: $descriptionLong
        descriptionShort: $descriptionShort
        id: $id
        tagName: $tagName
        tags: $tags
        title: $title
      }
    )
  }
`;

export { updateCollectionMutation };

import gql from 'graphql-tag';

const readCollectionsQuery = gql`
  query readCollections {
    readCollections {
      descriptionLong
      descriptionShort
      id
      tagName
      title
    }
  }
`;

export { readCollectionsQuery };

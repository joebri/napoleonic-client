import gql from 'graphql-tag';

export default gql`
  query readCollections {
    readCollections {
      descriptionLong
      descriptionShort
      id
      tagName
      tags
      title
    }
  }
`;

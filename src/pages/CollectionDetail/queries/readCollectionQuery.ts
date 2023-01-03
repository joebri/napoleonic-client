import gql from 'graphql-tag';

export default gql`
  query readCollection($id: ID!) {
    readCollection(id: $id) {
      descriptionLong
      descriptionShort
      id
      tagName
      tags
      title
    }
  }
`;

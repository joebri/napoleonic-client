import gql from 'graphql-tag';

export default gql`
  query readItem($id: ID!) {
    readItem(id: $id) {
      descriptionLong
      descriptionShort
      id
      rating
      publicId
      tags
      title
    }
  }
`;

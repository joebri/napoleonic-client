import gql from 'graphql-tag';

export default gql`
  query readItem($id: ID!) {
    readItem(id: $id) {
      artist {
        name
      }
      contentId
      descriptionLong
      descriptionShort
      id
      publicId
      regiment
      regiments
      tags
      title
      yearFrom
      yearTo
    }
  }
`;

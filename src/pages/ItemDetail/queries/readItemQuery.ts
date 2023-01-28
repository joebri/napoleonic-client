import gql from 'graphql-tag';

const readItemQuery = gql`
  query readItem($id: ID!) {
    readItem(id: $id) {
      artist
      descriptionLong
      descriptionShort
      id
      rating
      publicId
      regiments
      tags
      title
      yearFrom
      yearTo
    }
  }
`;

export { readItemQuery };

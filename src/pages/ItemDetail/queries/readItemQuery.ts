import gql from 'graphql-tag';

const readItemQuery = gql`
  query readItem($id: ID!) {
    readItem(id: $id) {
      artist
      descriptionLong
      descriptionShort
      id
      publicId
      rating
      regiments
      tags
      title
      yearFrom
      yearTo
    }
  }
`;

export { readItemQuery };

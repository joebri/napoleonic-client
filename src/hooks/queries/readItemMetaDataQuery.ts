import gql from 'graphql-tag';

const readItemMetaDataQuery = gql`
  query readItemMetaData($publicId: String!) {
    readItemMetaData(publicId: $publicId) {
      bytes
      height
      url
      width
    }
  }
`;

export { readItemMetaDataQuery };

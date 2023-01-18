import gql from 'graphql-tag';

export default gql`
  query readItemMetaData($publicId: String!) {
    readItemMetaData(publicId: $publicId) {
      bytes
      height
      url
      width
    }
  }
`;

import gql from 'graphql-tag';

export default gql`
  query readTags {
    readTags {
      group
      name
    }
  }
`;

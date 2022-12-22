import gql from 'graphql-tag';

export default gql`
  mutation deleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

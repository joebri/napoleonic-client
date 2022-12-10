import gql from 'graphql-tag';

// export default gql`
//   query readItemsByRegiments(
//     $regiments: [String!]!
//     $pageNumber: Int!
//     $pageSize: Int!
//   ) {
//     readItemsByRegiments(
//       input: {
//         regiments: $regiments
//         pageNumber: $pageNumber
//         pageSize: $pageSize
//       }
//     ) {
//       count
//       items {
//         artist {
//           name
//         }
//         contentId
//         descriptionLong
//         descriptionShort
//         id
//         publicId
//         regiment
//         regiments
//         tags
//         title
//         yearFrom
//         yearTo
//       }
//     }
//   }
// `;

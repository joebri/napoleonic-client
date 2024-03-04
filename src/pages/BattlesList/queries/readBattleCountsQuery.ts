import gql from 'graphql-tag';

const readBattleCountsQuery = gql`
    query readBattleCounts($ratings: [Int!]!) {
        readBattleCounts(input: { ratings: $ratings }) {
            name
            count
        }
    }
`;

export { readBattleCountsQuery };

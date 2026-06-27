import { TypedDocumentNode } from '@apollo/client';
import { BattleCount } from '@models/BattleCount.model';
import gql from 'graphql-tag';

export type ReadBattleCountsResponse = {
    readBattleCounts: BattleCount[];
};

export type ReadBattleCountsVariables = {
    ratings: number[];
};

export const readBattleCountsQuery: TypedDocumentNode<
    ReadBattleCountsResponse,
    ReadBattleCountsVariables
> = gql`
    query readBattleCounts($ratings: [Int!]!) {
        readBattleCounts(input: { ratings: $ratings }) {
            name
            count
        }
    }
`;

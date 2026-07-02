import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { NavigationTagType } from '@enums/navigationTagType.enum';
import { useHelmet } from '@hooks/useHelmet';
import {
    HeaderNavigationTagsProps,
    useNavigationTags,
} from '@hooks/useNavigationTags';
import { TagCount as BattleCount } from '@models/TagCount.model';
import {
    useHeaderTitleStateSet,
    useRatingsStateGet,
    useSortFieldState,
} from '@state';
import { TagsSortOrder } from '@state/sortField.state';
import { ratingsToArray } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { readBattleCountsQuery } from './queries/readBattleCountsQuery';

export const useBattlesList = (moduleName: string) => {
    const location = useLocation();
    const helmet = useHelmet();
    const navigate = useNavigate();

    const setHeaderTitle = useHeaderTitleStateSet();
    const { clearHeaderNavigationTags, setHeaderNavigationTags } =
        useNavigationTags();
    const ratings = useRatingsStateGet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [battleCounts, setBattleCounts] = useState<BattleCount[]>([]);
    const [sortField, setSortField] = useSortFieldState();

    const [selectedBattleNames, setSelectedBattleNames] = useState(new Set());

    const sortedBattleCounts = useMemo(() => {
        return sortField.battleTagsSort === TagsSortOrder.Name
            ? battleCounts.toSorted((a, b) => a.name.localeCompare(b.name))
            : battleCounts.toSorted((a, b) => b.count - a.count);
    }, [sortField.battleTagsSort, battleCounts]);

    const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

    const [readBattleCounts, { data, error }] = useLazyQuery(
        readBattleCountsQuery
    );

    useEffect(() => {
        if (data?.readBattleCounts) {
            setBattleCounts(data.readBattleCounts);
            setSortField((prevSortField) => {
                return {
                    ...prevSortField,
                    battleTagsSort: TagsSortOrder.Count,
                };
            });
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data, setSortField]);

    useEffect(() => {
        if (error) {
            logError({
                moduleName,
                name: 'readBattleCounts',
                exception: error,
            });
            setLoadStatus(LoadStatus.ERROR);
        }
    }, [error, moduleName]);

    useEffect(() => {
        helmet.setTitle('Uniformology: Battles');
    }, [helmet]);

    useEffect(() => {
        setHeaderTitle('Battles');
        clearHeaderNavigationTags();
    }, [clearHeaderNavigationTags, setHeaderTitle]);

    useEffect(() => {
        const selectedRatings = ratingsToArray(ratings);

        readBattleCounts({
            variables: {
                ratings: selectedRatings,
            },
        });
    }, [location.key, ratings, readBattleCounts]);

    const updateSelectedBattles = (name: string) => {
        setSelectedBattleNames((previous) => {
            const next = new Set(previous);
            if (next.has(name)) {
                next.delete(name);
            } else {
                next.add(name);
            }

            setIsSearchEnabled(next.size > 0);

            return next;
        });
    };

    const getSelectedBattleNames = () => {
        const selected = battleCounts
            .filter((battle: BattleCount) =>
                selectedBattleNames.has(battle.name)
            )
            .map((battle: BattleCount) => battle.name);

        return selected;
    };

    const showSelectedBattles = () => {
        const battleNames = getSelectedBattleNames();

        setHeaderNavigationTags({
            id: '',
            names: battleNames,
            tagType: NavigationTagType.Battles,
            title: battleNames.join(' / '),
        } as HeaderNavigationTagsProps);

        const encodedBattleNames = encodeURIComponent(battleNames.join('||'));
        navigate(`/gallery?battles=${encodedBattleNames}`);
    };

    return {
        battleCounts: sortedBattleCounts,
        error,
        getSelectedBattleNames,
        isSearchEnabled,
        loadStatus,
        showSelectedBattles,
        updateSelectedBattles,
        selectedBattleNames,
    };
};

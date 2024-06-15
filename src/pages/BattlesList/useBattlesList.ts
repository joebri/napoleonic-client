import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { useHeaderTitleStateSet, useRatingsStateGet } from 'state';
import { BattleTag } from 'types';
import { ratingsToArray } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { readBattleCountsQuery } from './queries/readBattleCountsQuery';

export const useBattlesList = (moduleName: string) => {
    const navigate = useNavigate();
    const location = useLocation();

    const setHeaderTitle = useHeaderTitleStateSet();
    const ratings = useRatingsStateGet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [battles, setBattles] = useState<BattleTag[]>([]);
    const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

    const { clearHeaderNavigationTags } = useNavigationTags();

    const [readBattleCounts, { error }] = useLazyQuery(readBattleCountsQuery, {
        onCompleted: (data) => {
            setBattles(data.readBattleCounts);
            setLoadStatus(LoadStatus.LOADED);
        },
        onError: (exception) => {
            logError({ moduleName, name: 'readBattleCounts', exception });
            setLoadStatus(LoadStatus.ERROR);
        },
    });

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

    const handleChipClick = (index: number) => {
        let newBattles: BattleTag[] = battles.map((battle) => {
            return { ...battle };
        });
        newBattles[index].isSelected = !newBattles[index].isSelected;

        const isAnySelected = newBattles.some((battle: BattleTag) => {
            return battle.isSelected;
        });
        setIsSearchEnabled(isAnySelected);

        setBattles(newBattles);
    };

    const handleSearchClick = () => {
        const selected = encodeURIComponent(
            battles
                .filter((battle: BattleTag) => battle.isSelected)
                .map((battle) => battle.name)
                .join('||')
        );
        navigate(`/gallery?battles=${selected}`);
    };

    return {
        handleChipClick,
        handleSearchClick,
        isSearchEnabled,
        loadStatus,
        error,
        battles,
    };
};

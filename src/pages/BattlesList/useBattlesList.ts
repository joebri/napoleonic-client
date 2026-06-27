import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useHelmet } from '@hooks/useHelmet';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { BattleCount } from '@models/BattleCount.model';
import { BattleTag } from '@models/BattleTag.model';
import { useHeaderTitleStateSet, useRatingsStateGet } from '@state';
import { ratingsToArray } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { readBattleCountsQuery } from './queries/readBattleCountsQuery';

export const useBattlesList = (moduleName: string) => {
    const location = useLocation();
    const helmet = useHelmet();
    const navigate = useNavigate();

    const setHeaderTitle = useHeaderTitleStateSet();
    const ratings = useRatingsStateGet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [battles, setBattles] = useState<BattleCount[]>([]);
    const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

    const { clearHeaderNavigationTags } = useNavigationTags();

    const [readBattleCounts, { data, error }] = useLazyQuery(
        readBattleCountsQuery
    );

    useEffect(() => {
        if (data?.readBattleCounts) {
            setBattles(data.readBattleCounts);
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data]);

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

    const updateSelectedBattles = (index: number) => {
        let newBattles: BattleTag[] = battles.map((battle) => {
            return { ...battle };
        });
        newBattles[index].isSelected = !newBattles[index].isSelected;
        setBattles(newBattles);

        const isAnySelected = newBattles.some((battle: BattleTag) => {
            return battle.isSelected;
        });
        setIsSearchEnabled(isAnySelected);
    };

    const getSelected = () => {
        const selected = encodeURIComponent(
            battles
                .filter((battle: BattleTag) => battle.isSelected)
                .map((battle) => battle.name)
                .join('||')
        );
        return selected;
    };

    const showSelectedBattles = () => {
        const selected = getSelected();
        navigate(`/gallery?battles=${selected}`);
    };

    return {
        battles,
        error,
        getSelected,
        isSearchEnabled,
        loadStatus,
        showSelectedBattles,
        updateSelectedBattles,
    };
};

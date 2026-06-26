import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useHelmet } from '@hooks/useHelmet';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { RegimentCount } from '@models/RegimentCount.model';
import { Tag } from '@models/Tag.model';
import {
    useHeaderTitleStateSet,
    useIncludeUnknownYearStateGet,
    useRatingsStateGet,
    useTagsStateGet,
    useYearRangeStateGet,
} from '@state';
import { ratingsToArray } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { readRegimentCountsQuery } from './queries/readRegimentCountsQuery';

export const useRegimentList = (moduleName: string) => {
    const location = useLocation();
    const helmet = useHelmet();

    const { clearHeaderNavigationTags } = useNavigationTags();
    const setHeaderTitle = useHeaderTitleStateSet();

    const includeUnknownYear = useIncludeUnknownYearStateGet();
    const ratings = useRatingsStateGet();
    const tags = useTagsStateGet();
    const yearRange = useYearRangeStateGet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [regiments, setRegiments] = useState<RegimentCount[]>([]);
    const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

    useEffect(() => {
        helmet.setTitle('Uniformology: Regiments');
    }, [helmet]);

    useEffect(() => {
        setHeaderTitle('Regiments');
        clearHeaderNavigationTags();
    }, [clearHeaderNavigationTags, setHeaderTitle]);

    const [readRegimentCounts, { data, error }] = useLazyQuery(
        readRegimentCountsQuery
    );

    useEffect(() => {
        if (data?.readRegimentCounts) {
            const regiments: RegimentCount[] = data.readRegimentCounts.map(
                (regiment: RegimentCount) => {
                    return { ...regiment, isSelected: false };
                }
            );
            setRegiments(regiments);
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            logError({
                moduleName,
                name: 'readRegimentCounts',
                exception: error,
            });
            setLoadStatus(LoadStatus.ERROR);
        }
    }, [error, moduleName]);

    useEffect(() => {
        const selectedRatings = ratingsToArray(ratings);

        const tagNames = tags
            .filter((tag: Tag) => {
                return tag.isSelected;
            })
            .map((tag: Tag) => {
                return tag.name;
            });

        readRegimentCounts({
            variables: {
                ratings: selectedRatings,
                tags: tagNames,
                yearRange,
                includeUnknownYear,
            },
        });
    }, [
        location.key,
        ratings,
        tags,
        yearRange,
        includeUnknownYear,
        readRegimentCounts,
    ]);

    const updateSelectedRegiments = (index: number) => {
        let newRegiments: RegimentCount[] = [...regiments];
        newRegiments[index].isSelected = !newRegiments[index].isSelected;

        const isAnySelected = newRegiments.some((regiment: RegimentCount) => {
            return regiment.isSelected;
        });

        setIsSearchEnabled(isAnySelected);
        setRegiments(newRegiments);
    };

    const getSelectedRegiments = () => {
        const selected = regiments
            .filter((regiment: RegimentCount) => regiment.isSelected)
            .map((regiment: RegimentCount) =>
                encodeURIComponent(regiment.name)
            );
        return selected;
    };

    return {
        error,
        getSelectedRegiments,
        isSearchEnabled,
        loadStatus,
        regiments,
        updateSelectedRegiments,
    };
};

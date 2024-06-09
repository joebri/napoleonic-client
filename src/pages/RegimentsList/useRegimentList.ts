import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useNavigationTags } from 'hooks/useNavigationTags';
import {
    useHeaderTitleStateSet,
    useIncludeUnknownYearStateGet,
    useRatingsStateGet,
    useTagsStateGet,
    useYearRangeStateGet,
} from 'state';
import { Tag } from 'types';
import { RegimentTag } from 'types/RegimentTag.type';
import { ratingsToArray } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { readRegimentCountsQuery } from './queries/readRegimentCountsQuery';

export const useRegimentList = (moduleName: string) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { clearHeaderNavigationTags } = useNavigationTags();
    const setHeaderTitle = useHeaderTitleStateSet();

    const includeUnknownYear = useIncludeUnknownYearStateGet();
    const ratings = useRatingsStateGet();
    const tags = useTagsStateGet();
    const yearRange = useYearRangeStateGet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [regiments, setRegiments] = useState<RegimentTag[]>([]);
    const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

    useEffect(() => {
        setHeaderTitle('Regiments');
        clearHeaderNavigationTags();
    }, [clearHeaderNavigationTags, setHeaderTitle]);

    const [readRegimentCounts, { error }] = useLazyQuery(
        readRegimentCountsQuery,
        {
            onCompleted: (data) => {
                const regiments: RegimentTag[] = data.readRegimentCounts.map(
                    (regiment: RegimentTag) => {
                        return { ...regiment, isSelected: false };
                    }
                );
                setRegiments(regiments);
                setLoadStatus(LoadStatus.LOADED);
            },
            onError: (exception) => {
                logError({ moduleName, name: 'readRegimentCounts', exception });
                setLoadStatus(LoadStatus.ERROR);
            },
        }
    );

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

    const handleChipClick = (index: number) => {
        let newRegiments: RegimentTag[] = [...regiments];
        newRegiments[index].isSelected = !newRegiments[index].isSelected;

        const isAnySelected = newRegiments.some((regiment: RegimentTag) => {
            return regiment.isSelected;
        });

        setIsSearchEnabled(isAnySelected);
        setRegiments(newRegiments);
    };

    const handleSearchClick = () => {
        const selected = regiments
            .filter((regiment: RegimentTag) => regiment.isSelected)
            .map((regiment: RegimentTag) => encodeURIComponent(regiment.name));

        navigate(`/gallery?regiments=${selected.join('||')}`);
    };

    return {
        handleChipClick,
        handleSearchClick,
        isSearchEnabled,
        loadStatus,
        error,
        regiments,
    };
};

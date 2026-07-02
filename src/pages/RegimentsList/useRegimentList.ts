import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { NavigationTagType } from '@enums/navigationTagType.enum';
import { useHelmet } from '@hooks/useHelmet';
import {
    HeaderNavigationTagsProps,
    useNavigationTags,
} from '@hooks/useNavigationTags';
import { FilterTag } from '@models/FilterTag.model';
import { TagCount as RegimentCount } from '@models/TagCount.model';
import {
    useHeaderTitleStateSet,
    useIncludeUnknownYearStateGet,
    useRatingsStateGet,
    useSortFieldState,
    useTagsStateGet,
    useYearRangeStateGet,
} from '@state';
import { TagsSortOrder } from '@state/sortField.state';
import { ratingsToArray } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { readRegimentCountsQuery } from './queries/readRegimentCountsQuery';

export const useRegimentList = (moduleName: string) => {
    const helmet = useHelmet();
    const { clearHeaderNavigationTags, setHeaderNavigationTags } =
        useNavigationTags();
    const navigate = useNavigate();

    const setHeaderTitle = useHeaderTitleStateSet();

    const includeUnknownYear = useIncludeUnknownYearStateGet();
    const ratings = useRatingsStateGet();
    const filterTags = useTagsStateGet();
    const yearRange = useYearRangeStateGet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [regimentCounts, setRegimentCounts] = useState<RegimentCount[]>([]);
    const [sortField, setSortField] = useSortFieldState();
    const [selectedRegimentNames, setSelectedRegimentNames] = useState(
        new Set()
    );

    const sortedRegimentCounts = useMemo(() => {
        return sortField.regimentTagsSort === TagsSortOrder.Name
            ? regimentCounts.toSorted((a, b) => a.name.localeCompare(b.name))
            : regimentCounts.toSorted((a, b) => b.count - a.count);
    }, [sortField.regimentTagsSort, regimentCounts]);

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
            setSortField((previous) => {
                return {
                    ...previous,
                    allTagsSort: TagsSortOrder.Count,
                };
            });
            setRegimentCounts(data?.readRegimentCounts);
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data, setSortField]);

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

        const filterTagNames = filterTags
            .filter((tag: FilterTag) => {
                return tag.isSelected;
            })
            .map((tag: FilterTag) => {
                return tag.name;
            });

        readRegimentCounts({
            variables: {
                ratings: selectedRatings,
                tags: filterTagNames,
                yearRange,
                includeUnknownYear,
            },
        });
    }, [
        ratings,
        filterTags,
        yearRange,
        includeUnknownYear,
        readRegimentCounts,
    ]);

    const getSelectedRegimentNames = () => {
        const selected = regimentCounts
            .filter((regiment: RegimentCount) =>
                selectedRegimentNames.has(regiment.name)
            )
            .map((regiment: RegimentCount) => regiment.name);
        return selected;
    };

    const updateSelectedRegiments = (name: string) => {
        setSelectedRegimentNames((previous) => {
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

    const showSelectedRegiments = () => {
        const regimentNames = getSelectedRegimentNames();

        setHeaderNavigationTags({
            id: '',
            names: regimentNames,
            tagType: NavigationTagType.Regiments,
            title: regimentNames.join(' / '),
        } as HeaderNavigationTagsProps);

        const encodedRegimentNames = encodeURIComponent(
            regimentNames.join('||')
        );
        navigate(`/gallery?regiments=${encodedRegimentNames}`);
    };

    return {
        error,
        showSelectedRegiments,
        isSearchEnabled,
        loadStatus,
        regimentCounts: sortedRegimentCounts,
        selectedRegimentNames,
        updateSelectedRegiments,
    };
};

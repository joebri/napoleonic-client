import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { NavigationTagType } from '@enums/navigationTagType.enum';
import { useHelmet } from '@hooks/useHelmet';
import {
    HeaderNavigationTagsProps,
    useNavigationTags,
} from '@hooks/useNavigationTags';
import { FilterTag } from '@models/FilterTag.model';
import { TagCount as ArtistCount } from '@models/TagCount.model';
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
import { useDebugValue, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { readArtistCountsQuery } from './queries/readArtistCountsQuery';

export const useArtistsList = (moduleName: string) => {
    const helmet = useHelmet();
    const navigate = useNavigate();

    const setHeaderTitle = useHeaderTitleStateSet();

    const includeUnknownYear = useIncludeUnknownYearStateGet();
    const ratings = useRatingsStateGet();
    const filterTags = useTagsStateGet();
    const yearRange = useYearRangeStateGet();

    useDebugValue(yearRange, (yearRange) => {
        return `Year From: ${yearRange[0]}, Year To: ${yearRange[1]}`;
    });

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [artistCounts, setArtistCounts] = useState<ArtistCount[]>([]);
    const [sortField, setSortField] = useSortFieldState();
    const [selectedArtistNames, setSelectedArtistNames] = useState(new Set());

    const sortedArtistCounts = useMemo(() => {
        return sortField.artistTagsSort === TagsSortOrder.Name
            ? artistCounts.toSorted((a, b) => a.name.localeCompare(b.name))
            : artistCounts.toSorted((a, b) => b.count - a.count);
    }, [sortField.artistTagsSort, artistCounts]);

    const [isSearchEnabled, setIsSearchEnabled] = useState(false);

    const { clearHeaderNavigationTags, setHeaderNavigationTags } =
        useNavigationTags();

    const [readArtistCounts, { data, error }] = useLazyQuery(
        readArtistCountsQuery
    );

    useEffect(() => {
        if (data?.readArtistCounts) {
            setArtistCounts(data.readArtistCounts);
            setSortField((prevSortField) => {
                return {
                    ...prevSortField,
                    allTagsSort: TagsSortOrder.Count,
                };
            });
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data, setSortField]);

    useEffect(() => {
        if (error) {
            logError({
                moduleName,
                name: 'readArtistCounts',
                exception: error,
            });
            setLoadStatus(LoadStatus.ERROR);
        }
    }, [error, moduleName]);

    useEffect(() => {
        helmet.setTitle('Uniformology: Artists');
    }, [helmet]);

    useEffect(() => {
        setHeaderTitle('Artists');
        clearHeaderNavigationTags();
    }, [clearHeaderNavigationTags, setHeaderTitle]);

    useEffect(() => {
        const selectedRatings = ratingsToArray(ratings);

        const filterTagNames = filterTags
            .filter((tag: FilterTag) => {
                return tag.isSelected;
            })
            .map((tag: FilterTag) => {
                return tag.name;
            });

        readArtistCounts({
            variables: {
                ratings: selectedRatings,
                tags: filterTagNames,
                yearRange,
                includeUnknownYear,
            },
        });
    }, [ratings, filterTags, readArtistCounts, yearRange, includeUnknownYear]);

    const getSelectedArtistNames = () => {
        const selected = artistCounts
            .filter((artist: ArtistCount) =>
                selectedArtistNames.has(artist.name)
            )
            .map((artist: ArtistCount) => artist.name);

        return selected;
    };

    const updateSelectedArtists = (name: string) => {
        setSelectedArtistNames((previous) => {
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

    const showSelectedArtists = () => {
        const artistNames = getSelectedArtistNames();

        setHeaderNavigationTags({
            id: '',
            names: artistNames,
            tagType: NavigationTagType.Artists,
            title: artistNames.join(' / '),
        } as HeaderNavigationTagsProps);

        const encodedArtistNames = encodeURIComponent(artistNames.join('||'));
        navigate(`/gallery?artists=${encodedArtistNames}`);
    };

    return {
        artistCounts: sortedArtistCounts,
        error,
        showSelectedArtists,
        isSearchEnabled,
        loadStatus,
        selectedArtistNames,
        updateSelectedArtists,
    };
};

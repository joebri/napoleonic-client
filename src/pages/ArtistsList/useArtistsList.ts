import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useHelmet } from '@hooks/useHelmet';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { ArtistCount } from '@models/ArtistCount.model';
import { Tag as FilterTag } from '@models/Tag.model';
import {
    useHeaderTitleStateSet,
    useIncludeUnknownYearStateGet,
    useRatingsStateGet,
    useTagsStateGet,
    useYearRangeStateGet,
} from '@state';
import { ratingsToArray } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useDebugValue, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { readArtistCountsQuery } from './queries/readArtistCountsQuery';

export const useArtistsList = (moduleName: string) => {
    const location = useLocation();
    const helmet = useHelmet();

    const includeUnknownYear = useIncludeUnknownYearStateGet();
    const ratings = useRatingsStateGet();
    const setHeaderTitle = useHeaderTitleStateSet();
    const filterTags = useTagsStateGet();
    const yearRange = useYearRangeStateGet();

    useDebugValue(yearRange, (yearRange) => {
        return `Year From: ${yearRange[0]}, Year To: ${yearRange[1]}`;
    });

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [artists, setArtists] = useState<ArtistCount[]>([]);

    const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

    const { clearHeaderNavigationTags } = useNavigationTags();

    const [readArtistCounts, { data, error }] = useLazyQuery(
        readArtistCountsQuery
    );

    useEffect(() => {
        if (data?.readArtistCounts) {
            setArtists(data.readArtistCounts);
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data]);

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
    }, [
        location.key,
        ratings,
        filterTags,
        readArtistCounts,
        yearRange,
        includeUnknownYear,
    ]);

    const getSelectedArtists = () => {
        const selected = encodeURIComponent(
            artists
                .filter((artist: ArtistCount) => artist.isSelected)
                .map((artist: ArtistCount) => artist.name)
                .join('||')
        );
        return selected;
    };

    const updateSelectedArtists = (index: number) => {
        let updatedArtists: ArtistCount[] = artists.map((artist) => {
            return { ...artist };
        });
        updatedArtists[index].isSelected = !updatedArtists[index].isSelected;
        setArtists(updatedArtists);

        const isAnySelected = updatedArtists.some((artist: ArtistCount) => {
            return artist.isSelected;
        });
        setIsSearchEnabled(isAnySelected);
    };

    return {
        artists,
        error,
        getSelectedArtists,
        isSearchEnabled,
        loadStatus,
        updateSelectedArtists,
    };
};

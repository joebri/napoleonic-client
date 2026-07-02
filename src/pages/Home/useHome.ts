import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { usePageNumberStateSet, useTagsState } from '@state';
import { logError } from '@utilities/logError';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { readTagsQuery } from './queries/readTagsQuery';

export const useHome = (moduleName: string) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const setPageNumber = usePageNumberStateSet();
    const [tags, setTags] = useTagsState();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );

    const [getTags, { data, error }] = useLazyQuery(readTagsQuery);

    useEffect(() => {
        if (data?.readTags) {
            setTags(data.readTags);
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data, setTags, tags.length]);

    useEffect(() => {
        if (error) {
            logError({ moduleName, name: 'getTags', exception: error });
            setTags([]);
            setLoadStatus(LoadStatus.ERROR);
        }
    }, [error, moduleName, setTags]);

    useEffect(() => {
        setLoadStatus(LoadStatus.LOADING);
        getTags();
    }, [getTags]);

    const resetSearchParams = useCallback(() => {
        const hasFilters =
            searchParams.has('artists') ||
            searchParams.has('battles') ||
            searchParams.has('regiments') ||
            searchParams.has('tags');

        if (hasFilters) {
            const currentParams = new URLSearchParams(searchParams);
            currentParams.delete('artists');
            currentParams.delete('battles');
            currentParams.delete('regiments');
            currentParams.delete('tags');
            setSearchParams(currentParams);
        }
    }, [searchParams, setSearchParams]);

    return {
        error,
        loadStatus,
        resetSearchParams,
        setPageNumber,
    };
};

import { useLazyQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { usePageNumberStateSet, useTagsState } from 'state';
import { logError } from 'utilities/logError';

import { readTagsQuery } from './queries/readTagsQuery';

export const useHome = (moduleName: string) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { isAuthenticated } = useAuth0();

    const setPageNumber = usePageNumberStateSet();
    const [tags, setTags] = useTagsState();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );

    const [getTags, { error }] = useLazyQuery(readTagsQuery, {
        onCompleted: (data) => {
            // TODO: When Authenticating from this page, the query is being re-run.
            if (tags.length === 0) {
                setTags(data.readTags);
                setLoadStatus(LoadStatus.LOADED);
            }
        },
        onError: (exception) => {
            logError({ moduleName, name: 'getTags', exception });
            setTags([]);
            setLoadStatus(LoadStatus.ERROR);
        },
    });

    useEffect(() => {
        if (isAuthenticated) {
            setLoadStatus(LoadStatus.LOADING);
            getTags();
        } else {
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [getTags, isAuthenticated]);

    const resetSearchParams = () => {
        searchParams.delete('artists');
        searchParams.delete('regiments');
        searchParams.delete('tags');
        setSearchParams(searchParams);
    };

    return {
        error,
        loadStatus,
        resetSearchParams,
        setPageNumber,
    };
};

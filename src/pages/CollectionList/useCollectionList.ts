import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { useHeaderTitleStateSet } from 'state';
import { Collection } from 'types';
import { logError } from 'utilities/logError';

import { readCollectionsQuery } from './queries/readCollectionsQuery';

export const useCollectionList = (moduleName: string) => {
    const navigate = useNavigate();

    const setHeaderTitle = useHeaderTitleStateSet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [collections, setCollections] = useState<Collection[]>([]);

    const { clearHeaderNavigationTags } = useNavigationTags();

    const [readCollections, { error }] = useLazyQuery(readCollectionsQuery, {
        onCompleted: (data) => {
            setCollections(data.readCollections);
            setLoadStatus(LoadStatus.LOADED);
        },
        onError: (exception) => {
            logError({ moduleName, name: 'readCollections', exception });
            setLoadStatus(LoadStatus.ERROR);
        },
    });

    useEffect(() => {
        setHeaderTitle('Collections');
        clearHeaderNavigationTags();
    }, [clearHeaderNavigationTags, setHeaderTitle]);

    useEffect(() => {
        readCollections();
    }, [readCollections]);

    const handleSearchClick = (collection: Collection) => {
        navigate(`/collectionDetailView/${collection.id}`);
    };

    return {
        collections,
        error,
        handleSearchClick,
        loadStatus,
    };
};

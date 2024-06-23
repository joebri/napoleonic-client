import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useHelmet } from 'hooks/useHelmet';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { useHeaderTitleStateSet } from 'state';
import { Collection } from 'types';
import { logError } from 'utilities/logError';

import { readCollectionsQuery } from './queries/readCollectionsQuery';

export const useCollectionList = (moduleName: string) => {
    const helmet = useHelmet();
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
        helmet.setTitle('Uniformology: Collections');
    }, [helmet]);

    useEffect(() => {
        setHeaderTitle('Collections');
        clearHeaderNavigationTags();
    }, [clearHeaderNavigationTags, setHeaderTitle]);

    useEffect(() => {
        readCollections();
    }, [readCollections]);

    return {
        collections,
        error,
        loadStatus,
    };
};

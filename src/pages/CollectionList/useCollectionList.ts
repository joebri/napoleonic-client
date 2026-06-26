import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useHelmet } from '@hooks/useHelmet';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { Collection } from '@models/Collection.model';
import { useHeaderTitleStateSet } from '@state';
import { logError } from '@utilities/logError';
import { useEffect, useState } from 'react';

import { readCollectionsQuery } from './queries/readCollectionsQuery';

type CollectionListProps = {
    moduleName: string;
};

export const useCollectionList = (props: CollectionListProps) => {
    const helmet = useHelmet();
    const setHeaderTitle = useHeaderTitleStateSet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [collections, setCollections] = useState<Collection[]>([]);

    const { clearHeaderNavigationTags } = useNavigationTags();

    const [readCollections, { data, error }] =
        useLazyQuery(readCollectionsQuery);

    useEffect(() => {
        if (data?.readCollections) {
            setCollections(data.readCollections);
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            logError({
                moduleName: props.moduleName,
                name: 'readCollections',
                exception: error,
            });
            setLoadStatus(LoadStatus.ERROR);
        }
    }, [error, props.moduleName]);

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

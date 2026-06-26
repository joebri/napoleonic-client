import { useLazyQuery, useMutation } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useHelmet } from '@hooks/useHelmet';
import { Collection } from '@models/Collection.model';
import { initialisedCollection } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { readCollectionQuery } from './queries/readCollectionQuery';
import { updateCollectionMutation } from './queries/updateCollectionMutation';

export const useCollectionDetailEdit = (moduleName: string) => {
    const { collectionId } = useParams();
    const helmet = useHelmet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [collection, setCollection] = useState<Collection>(
        initialisedCollection
    );
    const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);

    const [readCollection, { data, error }] = useLazyQuery(readCollectionQuery);

    useEffect(() => {
        if (data?.readCollection) {
            setCollection({
                ...data.readCollection,
            });
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data]);

    useEffect(() => {
        logError({
            moduleName,
            name: 'readCollection',
            exception: error,
            collectionId,
        });
        setLoadStatus(LoadStatus.ERROR);
    }, [collectionId, error, moduleName]);

    const loadForm = useCallback(() => {
        setLoadStatus(LoadStatus.LOADING);
        readCollection({ variables: { id: collectionId ?? '' } });
    }, [collectionId, readCollection]);

    useEffect(() => {
        helmet.setTitle('Uniformology: Edit Collection');
    }, [helmet]);

    useEffect(() => {
        loadForm();
    }, [collectionId, loadForm]);

    const updateFieldValue = (field: string, value: string | number) => {
        setCollection((priorCollection: Collection) => ({
            ...priorCollection,
            [field]: value,
        }));
    };

    const [updateCollection] = useMutation(updateCollectionMutation);

    const tryUpdate = async () => {
        try {
            await updateCollection({
                variables: {
                    descriptionLong: collection.descriptionLong.trim(),
                    descriptionShort: collection.descriptionShort.trim(),
                    id: collection.id,
                    tagName: collection.tagName.trim(),
                    title: collection.title.trim(),
                },
            });
        } catch (error) {
            logError({
                moduleName,
                name: 'tryUpdate',
                exception: error,
                message: 'Update failed.',
                collectionId: collection.id,
            });
            setIsMessageVisible(true);
        }
    };

    return {
        collection,
        collectionId,
        error,
        isMessageVisible,
        loadForm,
        loadStatus,
        setIsMessageVisible,
        tryUpdate,
        updateFieldValue,
    };
};

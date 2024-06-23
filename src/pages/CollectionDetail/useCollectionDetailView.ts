import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { NavigationTagType } from 'enums/navigationTagType.enum';
import { useHelmet } from 'hooks/useHelmet';
import {
    HeaderNavigationTagsProps,
    useNavigationTags,
} from 'hooks/useNavigationTags';
import { useHeaderTitleStateSet } from 'state';
import { Collection } from 'types/Collection.type';
import { initialisedCollection } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { deleteCollectionMutation } from './queries/deleteCollectionMutation';
import { readCollectionQuery } from './queries/readCollectionQuery';

export const useCollectionDetailView = (moduleName: string) => {
    let { collectionId } = useParams();
    const helmet = useHelmet();

    const setHeaderTitle = useHeaderTitleStateSet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [collection, setCollection] = useState<Collection>(
        initialisedCollection
    );
    const [isConfirmDeleteDialogVisible, setIsConfirmDeleteDialogVisible] =
        useState<boolean>(false);
    const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);

    const { setHeaderNavigationTags } = useNavigationTags();

    const [readCollection, { error }] = useLazyQuery(readCollectionQuery, {
        variables: { id: collectionId },
        onCompleted: (data) => {
            setCollection(data.readCollection);

            setHeaderNavigationTags({
                id: '',
                names: [data.readCollection.title],
                tagType: NavigationTagType.COLLECTIONS,
                title: data.readCollection.title,
            } as HeaderNavigationTagsProps);

            setLoadStatus(LoadStatus.LOADED);
        },
        onError: (exception) => {
            logError({
                moduleName,
                name: 'readCollection',
                exception,
                collectionId,
            });
            setLoadStatus(LoadStatus.ERROR);
        },
    });

    const [deleteCollection] = useMutation(deleteCollectionMutation);

    useEffect(() => {
        helmet.setTitle('Uniformology: Collection');
    }, [helmet]);

    useEffect(() => {
        setHeaderTitle('Collection');
    }, [setHeaderTitle]);

    useEffect(() => {
        const loadForm = () => {
            setLoadStatus(LoadStatus.LOADING);
            readCollection();
        };
        loadForm();
    }, [collectionId, readCollection]);

    const tryDelete = async () => {
        try {
            await deleteCollection({
                variables: {
                    id: collectionId,
                },
            });
        } catch (exception) {
            logError({
                moduleName,
                name: 'handleDeleteConfirmed',
                exception,
                message: 'Delete failed.',
                collectionId,
            });
            setIsConfirmDeleteDialogVisible(false);
            setIsMessageVisible(true);
        }
    };

    return {
        collection,
        collectionId,
        error,
        isConfirmDeleteDialogVisible,
        isMessageVisible,
        loadStatus,
        setIsConfirmDeleteDialogVisible,
        setIsMessageVisible,
        tryDelete,
    };
};

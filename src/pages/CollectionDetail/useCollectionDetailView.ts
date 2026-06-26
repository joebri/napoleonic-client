import { useLazyQuery, useMutation } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { NavigationTagType } from '@enums/navigationTagType.enum';
import { useHelmet } from '@hooks/useHelmet';
import {
    HeaderNavigationTagsProps,
    useNavigationTags,
} from '@hooks/useNavigationTags';
import { Collection } from '@models/Collection.model';
import { useHeaderTitleStateSet } from '@state';
import { initialisedCollection } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { deleteCollectionMutation } from './queries/deleteCollectionMutation';
import { readCollectionQuery } from './queries/readCollectionQuery';

type CollectionDetailProps = {
    moduleName: string;
};

export const useCollectionDetailView = (props: CollectionDetailProps) => {
    let { collectionId = '' } = useParams();
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

    const [readCollection, { data, error }] = useLazyQuery(readCollectionQuery);

    useEffect(() => {
        if (data?.readCollection) {
            setCollection(data.readCollection);

            setHeaderNavigationTags({
                id: '',
                names: [data.readCollection.title],
                tagType: NavigationTagType.COLLECTIONS,
                title: data.readCollection.title,
            } as HeaderNavigationTagsProps);

            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data, setHeaderNavigationTags]);

    useEffect(() => {
        if (error) {
            logError({
                moduleName: props.moduleName,
                name: 'readCollection',
                exception: error,
                collectionId,
            });
            setLoadStatus(LoadStatus.ERROR);
        }
    }, [collectionId, error, props.moduleName]);

    useEffect(() => {
        helmet.setTitle('Uniformology: Collection');
    }, [helmet]);

    useEffect(() => {
        setHeaderTitle('Collection');
    }, [setHeaderTitle]);

    useEffect(() => {
        const loadForm = () => {
            setLoadStatus(LoadStatus.LOADING);
            readCollection({ variables: { id: collectionId } });
        };
        loadForm();
    }, [collectionId, readCollection]);

    const [deleteCollection] = useMutation(deleteCollectionMutation);

    const tryDelete = async () => {
        try {
            await deleteCollection({
                variables: {
                    id: collectionId,
                },
            });
        } catch (error) {
            logError({
                moduleName: props.moduleName,
                name: 'handleDeleteConfirmed',
                exception: error,
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

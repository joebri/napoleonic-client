import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { Collection } from 'types';
import { initialisedCollection } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { readCollectionQuery } from './queries/readCollectionQuery';
import { updateCollectionMutation } from './queries/updateCollectionMutation';

export const useCollectionDetailEdit = (moduleName: string) => {
    let { collectionId } = useParams();
    const navigate = useNavigate();

    const viewPageURI = `/collectionDetailView/${collectionId}`;

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [collection, setCollection] = useState<Collection>(
        initialisedCollection
    );
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const [readCollection, { error }] = useLazyQuery(readCollectionQuery, {
        variables: { id: collectionId },
        onCompleted: (data) => {
            setCollection({
                ...data.readCollection,
            });
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

    const [updateCollection] = useMutation(updateCollectionMutation);

    const loadForm = useCallback(() => {
        setLoadStatus(LoadStatus.LOADING);
        readCollection();
    }, [readCollection]);

    useEffect(() => {
        loadForm();
    }, [collectionId, loadForm]);

    const handleEditChange = (field: string, value: string | number) => {
        setCollection((priorCollection: Collection) => ({
            ...priorCollection,
            [field]: value,
        }));
    };

    const handleEditCancelClick = () => {
        loadForm();
        navigate(viewPageURI);
    };

    const handleEditSaveClick = async () => {
        try {
            await updateCollection({
                variables: {
                    descriptionLong: collection.descriptionLong.trim(),
                    descriptionShort: collection.descriptionShort.trim(),
                    id: collection.id,
                    tagName: collection.tagName.trim(),
                    tags: collection.tags,
                    title: collection.title.trim(),
                },
            });
            navigate(viewPageURI);
        } catch (exception) {
            logError({
                moduleName,
                name: 'handleEditSaveClick',
                exception,
                message: 'Update failed.',
                collectionId: collection.id,
            });
            setShowMessage(true);
        }
    };

    const handleMessageClose = () => {
        setShowMessage(false);
    };

    return {
        collection,
        error,
        handleEditCancelClick,
        handleEditChange,
        handleEditSaveClick,
        handleMessageClose,
        loadStatus,
        showMessage,
    };
};

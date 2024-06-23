import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useHelmet } from 'hooks/useHelmet';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { Item } from 'types';
import { initialisedItem } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { deleteItemMutation } from './queries/deleteItemMutation';
import { readItemQuery } from './queries/readItemQuery';

export const useItemDetailView = (moduleName: string) => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const helmet = useHelmet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [item, setItem] = useState<Item>(initialisedItem);
    const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] =
        useState(false);
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const { enableLastNavigationTag } = useNavigationTags();

    const [deleteItem] = useMutation(deleteItemMutation);

    const [readItem, { error }] = useLazyQuery(readItemQuery, {
        variables: { id: itemId },
        onCompleted: (data) => {
            setItem(data.readItem);
            setLoadStatus(LoadStatus.LOADED);
        },
        onError: (exception) => {
            logError({ moduleName, name: 'readItem', exception, itemId });
            setLoadStatus(LoadStatus.ERROR);
        },
    });

    useEffect(() => {
        helmet.setTitle('Uniformology: Item');
    }, [helmet]);

    useEffect(() => {
        enableLastNavigationTag();
    }, [enableLastNavigationTag]);

    useEffect(() => {
        const loadForm = () => {
            setLoadStatus(LoadStatus.LOADING);
            readItem();
        };

        loadForm();
    }, [itemId, readItem]);

    const handleEditClick = () => {
        navigate(`/itemDetailEdit/${itemId}`);
    };

    const handleDeleteClick = () => {
        setShowConfirmDeleteDialog(true);
    };

    const handleDeleteCancelled = () => {
        setShowConfirmDeleteDialog(false);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await deleteItem({
                variables: {
                    id: itemId,
                },
            });
            navigate(`/gallery`);
        } catch (exception) {
            logError({
                moduleName,
                name: 'handleDeleteConfirmed',
                exception,
                message: 'Delete failed.',
                itemId,
            });
            setShowConfirmDeleteDialog(false);
            setShowMessage(true);
        }
    };

    const handleMessageClose = () => {
        setShowMessage(false);
    };

    return {
        error,
        handleDeleteCancelled,
        handleDeleteClick,
        handleDeleteConfirmed,
        handleEditClick,
        handleMessageClose,
        item,
        loadStatus,
        showConfirmDeleteDialog,
        showMessage,
    };
};

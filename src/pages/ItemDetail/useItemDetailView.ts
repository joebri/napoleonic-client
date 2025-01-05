import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useHelmet } from 'hooks/useHelmet';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { Item } from 'types';
import { initialisedItem } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { deleteItemMutation } from './queries/deleteItemMutation';
import { readItemQuery } from './queries/readItemQuery';

export type ItemDetailDeleteProps = {
    moduleName: string;
    onCompletedDelete: () => {};
};

export const useItemDetailView = (props: ItemDetailDeleteProps) => {
    const { itemId } = useParams();
    const helmet = useHelmet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [item, setItem] = useState<Item>(initialisedItem);
    const [isConfirmDeleteDialogVisible, setIsConfirmDeleteDialogVisible] =
        useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);

    const { enableLastNavigationTag } = useNavigationTags();

    const [deleteItem] = useMutation(deleteItemMutation);

    const [readItem, { error }] = useLazyQuery(readItemQuery, {
        variables: { id: itemId },
        onCompleted: (data) => {
            setItem(data.readItem);
            setLoadStatus(LoadStatus.LOADED);
        },
        onError: (exception) => {
            logError({
                moduleName: props.moduleName,
                name: 'readItem',
                exception,
                itemId,
            });
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

    const tryDelete = async () => {
        try {
            await deleteItem({
                variables: {
                    id: itemId,
                },
            });
            props.onCompletedDelete();
        } catch (exception) {
            logError({
                moduleName: props.moduleName,
                name: 'handleDeleteConfirmed',
                exception,
                message: 'Delete failed.',
                itemId,
            });
            setIsConfirmDeleteDialogVisible(false);
            setIsMessageVisible(true);
        }
    };

    return {
        error,
        isConfirmDeleteDialogVisible,
        isMessageVisible,
        item,
        loadStatus,
        setIsConfirmDeleteDialogVisible,
        setIsMessageVisible,
        tryDelete,
    };
};

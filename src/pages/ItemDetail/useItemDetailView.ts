import { useLazyQuery, useMutation } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useHelmet } from '@hooks/useHelmet';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { Item } from '@models/Item.model';
import { initialisedItem } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { deleteItemMutation } from './queries/deleteItemMutation';
import { readItemQuery } from './queries/readItemQuery';

export type ItemDetailDeleteProps = {
    moduleName: string;
    onCompletedDelete: () => {};
};

export const useItemDetailView = (props: ItemDetailDeleteProps) => {
    const { itemId = '' } = useParams();
    const helmet = useHelmet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [item, setItem] = useState<Item>(initialisedItem);
    const [isConfirmDeleteDialogVisible, setIsConfirmDeleteDialogVisible] =
        useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);

    const { enableLastNavigationTag } = useNavigationTags();

    const [readItem, { data, error }] = useLazyQuery(readItemQuery);

    useEffect(() => {
        if (data?.readItem) {
            setItem(data.readItem);
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            logError({
                moduleName: props.moduleName,
                name: 'readItem',
                exception: error,
                itemId,
            });
            setLoadStatus(LoadStatus.ERROR);
        }
    }, [error, itemId, props.moduleName]);

    useEffect(() => {
        helmet.setTitle('Uniformology: Item');
    }, [helmet]);

    useEffect(() => {
        enableLastNavigationTag();
    }, [enableLastNavigationTag]);

    useEffect(() => {
        const loadForm = () => {
            setLoadStatus(LoadStatus.LOADING);
            readItem({ variables: { id: itemId } });
        };

        loadForm();
    }, [itemId, readItem]);

    const [deleteItem] = useMutation(deleteItemMutation);

    const tryDelete = async () => {
        try {
            await deleteItem({
                variables: {
                    id: itemId,
                },
            });
            props.onCompletedDelete();
        } catch (error) {
            logError({
                moduleName: props.moduleName,
                name: 'handleDeleteConfirmed',
                exception: error,
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

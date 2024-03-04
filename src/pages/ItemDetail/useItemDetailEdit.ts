import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { Rating } from 'enums/rating.enum';
import { useConfirmExit } from 'hooks/useConfirmExit';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { Item } from 'types';
import { initialisedItem } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { readItemQuery } from './queries/readItemQuery';
import { updateItemMutation } from './queries/updateItemMutation';

export const useItemDetailEdit = (moduleName: string) => {
    const { itemId } = useParams();
    const navigate = useNavigate();

    const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
    const [item, setItem] = useState(initialisedItem);
    const [showMessage, setShowMessage] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const { enableLastNavigationTag } = useNavigationTags();

    useConfirmExit(isDirty);

    const [readItem, { error }] = useLazyQuery(readItemQuery, {
        variables: { id: itemId },
        onCompleted: (data) => {
            setItem({
                ...data.readItem,
                rating: data.readItem.rating || Rating.MEDIUM,
            });
            setLoadStatus(LoadStatus.LOADED);
        },
        onError: (exception) => {
            logError({ moduleName, name: 'readItem', exception, itemId });
            setLoadStatus(LoadStatus.ERROR);
        },
    });

    const [updateItem] = useMutation(updateItemMutation, {
        onCompleted: () => {
            navigate(`/itemDetailView/${item.id}`);
        },
        onError: (exception) => {
            logError({ moduleName, name: 'updateItem', exception, itemId });
            setShowMessage(true);
        },
    });

    useEffect(() => {
        enableLastNavigationTag();
    }, [enableLastNavigationTag]);

    const loadForm = useCallback(() => {
        setLoadStatus(LoadStatus.LOADING);
        readItem();
    }, [readItem]);

    useEffect(() => {
        loadForm();
    }, [itemId, loadForm]);

    const handleEditChange = (field: string, value: string | number) => {
        setItem((priorItem: Item) => ({
            ...priorItem,
            [field]: value,
        }));
        setIsDirty(true);
    };

    const handleEditCancelClick = () => {
        loadForm();
        navigate(`/itemDetailView/${itemId}`);
    };

    const handleEditSaveClick = () => {
        updateItem({
            variables: {
                artist: item.artist?.trim(),
                descriptionLong: item.descriptionLong?.trim(),
                descriptionShort: item.descriptionShort?.trim(),
                id: item.id,
                publicId: item.publicId?.trim(),
                rating: parseInt(item.rating.toString()),
                regiments: item.regiments?.trim() || '',
                tags: item.tags,
                title: item.title?.trim(),
                yearFrom: item.yearFrom?.trim(),
                yearTo: item.yearTo?.trim(),
            },
        });
    };

    const handleMessageClose = () => {
        setShowMessage(false);
    };

    return {
        error,
        handleEditCancelClick,
        handleEditChange,
        handleEditSaveClick,
        handleMessageClose,
        item,
        loadStatus,
        showMessage,
    };
};

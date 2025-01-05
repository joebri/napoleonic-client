import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { Rating } from 'enums/rating.enum';
import { useConfirmExit } from 'hooks/useConfirmExit';
import { useHelmet } from 'hooks/useHelmet';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { Item } from 'types';
import { initialisedItem } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { readItemQuery } from './queries/readItemQuery';
import { updateItemMutation } from './queries/updateItemMutation';

export type ItemDetailEditProps = {
    moduleName: string;
    onCompletedEdit: (itemId: string) => {};
};

export const useItemDetailEdit = (props: ItemDetailEditProps) => {
    const { itemId } = useParams();
    const helmet = useHelmet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [item, setItem] = useState<Item>(initialisedItem);
    const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);

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
            logError({
                moduleName: props.moduleName,
                name: 'readItem',
                exception,
                itemId,
            });
            setLoadStatus(LoadStatus.ERROR);
        },
    });

    const [updateItem] = useMutation(updateItemMutation, {
        onCompleted: () => {
            props.onCompletedEdit(item.id);
        },
        onError: (exception) => {
            logError({
                moduleName: props.moduleName,
                name: 'updateItem',
                exception,
                itemId,
            });
            setIsMessageVisible(true);
        },
    });

    useEffect(() => {
        helmet.setTitle('Uniformology: Edit Item');
    }, [helmet]);

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

    const updateFieldValue = (field: string, value: string | number) => {
        setItem((priorItem: Item) => ({
            ...priorItem,
            [field]: value,
        }));
        setIsDirty(true);
    };

    const tryUpdate = () => {
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

    return {
        error,
        isMessageVisible,
        item,
        itemId,
        loadForm,
        loadStatus,
        setIsMessageVisible,
        tryUpdate,
        updateFieldValue,
    };
};

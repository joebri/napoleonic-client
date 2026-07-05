import { useLazyQuery, useMutation } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { Rating } from '@enums/rating.enum';
// import { useConfirmExit } from '@hooks/useConfirmExit';
import { useHelmet } from '@hooks/useHelmet';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { Item } from '@models/Item.model';
import { initialisedItem } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { readItemQuery } from './queries/readItemQuery';
import { updateItemMutation } from './queries/updateItemMutation';

export type ItemDetailEditProps = {
    moduleName: string;
    onCompletedEdit: (itemId: string) => {};
};

export const useItemDetailEdit = (props: ItemDetailEditProps) => {
    const { itemId = '' } = useParams();
    const helmet = useHelmet();
    const { enableLastNavigationTag } = useNavigationTags();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [item, setItem] = useState<Item>(initialisedItem);
    const [isMessageVisible, setIsMessageVisible] = useState(false);

    const [readItem, { data, error }] = useLazyQuery(readItemQuery);

    useEffect(() => {
        if (data?.readItem) {
            setItem({
                ...data.readItem,
                rating: data.readItem.rating || Rating.MEDIUM,
            });
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

    const loadForm = useCallback(() => {
        setLoadStatus(LoadStatus.LOADING);
        readItem({ variables: { id: itemId } });
    }, [itemId, readItem]);

    useEffect(() => {
        loadForm();
    }, [itemId, loadForm]);

    const [updateItem] = useMutation(updateItemMutation);

    const tryUpdate = (item: Item) => {
        setItem(item);
        try {
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
            props.onCompletedEdit(item.id);
        } catch (error) {
            logError({
                moduleName: props.moduleName,
                name: 'updateItem',
                exception: error,
                itemId,
            });
            setIsMessageVisible(true);
        }
    };

    useEffect(() => {
        helmet.setTitle('Uniformology: Edit Item');
    }, [helmet]);

    useEffect(() => {
        enableLastNavigationTag();
    }, [enableLastNavigationTag]);

    return {
        error,
        isMessageVisible,
        item,
        itemId,
        loadForm,
        loadStatus,
        setIsMessageVisible,
        tryUpdate,
    };
};

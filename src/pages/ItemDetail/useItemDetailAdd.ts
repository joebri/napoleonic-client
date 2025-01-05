import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import { useHelmet } from 'hooks/useHelmet';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { Item } from 'types';
import { initialisedItem } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { createItemMutation } from './queries/createItemMutation';

export type ItemDetailAddProps = {
    moduleName: string;
    onCompletedAdd: (itemId: string) => {};
};

export const useItemDetailAdd = (props: ItemDetailAddProps) => {
    const helmet = useHelmet();

    const [template] = useLocalStorage<any>('template', {
        artist: '',
        tags: '',
        urlRoot: '',
        yearFrom: '',
        yearTo: '',
    });

    const [item, setItem] = useState<Item>({
        ...initialisedItem,
        artist: template.artist,
        publicId: template.urlRoot,
        tags: template.tags.split(','),
        yearFrom: template.yearFrom,
        yearTo: template.yearTo,
    });
    const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);

    const { enableLastNavigationTag } = useNavigationTags();

    useEffect(() => {
        helmet.setTitle('Uniformology: Add Item');
    }, [helmet]);

    useEffect(() => {
        enableLastNavigationTag();
    }, [enableLastNavigationTag]);

    const [createItem] = useMutation(createItemMutation, {
        onCompleted: (data) => {
            props.onCompletedAdd(data.createItem);
        },
        onError: (exception) => {
            logError({
                moduleName: props.moduleName,
                name: 'createItem',
                exception,
                message: 'Create failed.',
            });
            setIsMessageVisible(true);
        },
    });

    const updateFieldValue = (field: string, value: string | number) => {
        setItem((priorItem: Item) => ({
            ...priorItem,
            [field]: value,
        }));
    };

    const tryCreate = () => {
        createItem({
            variables: {
                artist: item.artist?.trim(),
                descriptionLong: item.descriptionLong?.trim(),
                descriptionShort: item.descriptionShort?.trim(),
                publicId: item.publicId?.trim(),
                rating: parseInt(item.rating.toString()),
                regiments: item.regiments?.trim(),
                tags: item.tags,
                title: item.title?.trim(),
                yearFrom: item.yearFrom?.trim(),
                yearTo: item.yearTo?.trim(),
            },
        });
    };

    return {
        isMessageVisible,
        item,
        setIsMessageVisible,
        tryCreate,
        updateFieldValue,
    };
};

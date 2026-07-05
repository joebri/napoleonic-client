import { useMutation } from '@apollo/client/react';
import { useHelmet } from '@hooks/useHelmet';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { Item } from '@models/Item.model';
import { initialisedItem } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useEffect, useState } from 'react';

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

    const [createItem] = useMutation(createItemMutation);

    const tryCreateItem = async (item: Item) => {
        setItem(item);
        try {
            const response = await createItem({
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

            if (response.data?.createItem) {
                props.onCompletedAdd(response.data.createItem);
            }
        } catch (error) {
            logError({
                moduleName: props.moduleName,
                name: 'createItem',
                exception: error,
                message: 'Create failed.',
            });
            setIsMessageVisible(true);
        }
    };

    return {
        isMessageVisible,
        item,
        setIsMessageVisible,
        tryCreateItem,
    };
};

import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useHelmet } from 'hooks/useHelmet';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { Item } from 'types';
import { initialisedItem } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { createItemMutation } from './queries/createItemMutation';

export const useItemDetailAdd = (moduleName: string) => {
    const navigate = useNavigate();
    const helmet = useHelmet();

    const [template] = useLocalStorage<any>('template', {
        artist: '',
        tags: '',
        urlRoot: '',
        yearFrom: '',
    });

    const [item, setItem] = useState<Item>({
        ...initialisedItem,
        artist: template.artist,
        publicId: template.urlRoot,
        tags: template.tags.split(','),
        yearFrom: template.yearFrom,
    });
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const { enableLastNavigationTag } = useNavigationTags();

    useEffect(() => {
        helmet.setTitle('Uniformology: Add Item');
    }, [helmet]);

    useEffect(() => {
        enableLastNavigationTag();
    }, [enableLastNavigationTag]);

    const [createItem] = useMutation(createItemMutation, {
        onCompleted: (data) => {
            navigate(`/itemDetailView/${data.createItem}`);
        },
        onError: (exception) => {
            logError({
                moduleName,
                name: 'createItem',
                exception,
                message: 'Create failed.',
            });
            setShowMessage(true);
        },
    });

    const handleEditChange = (field: string, value: string | number) => {
        setItem((priorItem: Item) => ({
            ...priorItem,
            [field]: value,
        }));
    };

    const handleEditCancelClick = () => {
        navigate(`/gallery`);
    };

    const handleEditSaveClick = () => {
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

    const handleMessageClose = () => {
        setShowMessage(false);
    };

    return {
        handleEditCancelClick,
        handleEditChange,
        handleEditSaveClick,
        handleMessageClose,
        item,
        showMessage,
    };
};

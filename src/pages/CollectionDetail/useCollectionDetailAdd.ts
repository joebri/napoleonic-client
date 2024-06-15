import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocalStorage } from 'hooks/useLocalStorage';
import { Collection } from 'types';
import { initialisedCollection } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { createCollectionMutation } from './queries/createCollectionMutation';

export const useCollectionDetailAdd = (moduleName: string) => {
    const navigate = useNavigate();

    const [template] = useLocalStorage<any>('template', {
        artist: '',
        tags: '',
        urlRoot: '',
        yearFrom: '',
    });

    const [collection, setCollection] = useState<Collection>({
        ...initialisedCollection,
        tags: template.tags.split(','),
    });
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const [createCollection] = useMutation(createCollectionMutation);

    const handleEditChange = (field: string, value: string | number) => {
        setCollection((priorCollection: Collection) => ({
            ...priorCollection,
            [field]: value,
        }));
    };

    const handleEditCancelClick = () => {
        navigate(`/collections`);
    };

    const handleEditSaveClick = async () => {
        try {
            const result = await createCollection({
                variables: {
                    descriptionLong: collection.descriptionLong.trim(),
                    descriptionShort: collection.descriptionShort.trim(),
                    tagName: collection.tagName.trim(),
                    tags: collection.tags,
                    title: collection.title.trim(),
                },
            });
            navigate(`/collectionDetailView/${result.data.createCollection}`);
        } catch (exception) {
            logError({
                moduleName,
                name: 'handleEditSaveClick',
                exception,
                message: 'Create failed.',
            });
            setShowMessage(true);
        }
    };

    const handleMessageClose = () => {
        setShowMessage(false);
    };

    return {
        collection,
        handleEditCancelClick,
        handleEditChange,
        handleEditSaveClick,
        handleMessageClose,
        showMessage,
    };
};

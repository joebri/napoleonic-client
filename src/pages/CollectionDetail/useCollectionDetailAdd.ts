import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import { useHelmet } from 'hooks/useHelmet';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { Collection } from 'types';
import { initialisedCollection } from 'utilities/helper';
import { logError } from 'utilities/logError';

import { createCollectionMutation } from './queries/createCollectionMutation';

export const useCollectionDetailAdd = (moduleName: string) => {
    const helmet = useHelmet();

    const [template] = useLocalStorage<any>('template', {
        artist: '',
        tags: '',
        urlRoot: '',
        yearFrom: '',
    });

    useEffect(() => {
        helmet.setTitle('Uniformology: Add Collection');
    }, [helmet]);

    const [collection, setCollection] = useState<Collection>({
        ...initialisedCollection,
        tags: template.tags.split(','),
    });
    const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);

    const [createCollection] = useMutation(createCollectionMutation);

    const updateFieldValue = (field: string, value: string | number) => {
        setCollection((priorCollection: Collection) => ({
            ...priorCollection,
            [field]: value,
        }));
    };

    const tryCreate = async (): Promise<any> => {
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
            return result.data.createCollection;
        } catch (exception) {
            logError({
                moduleName,
                name: 'handleEditSaveClick',
                exception,
                message: 'Create failed.',
            });
            setIsMessageVisible(true);
        }
    };

    return {
        collection,
        isMessageVisible,
        setIsMessageVisible,
        tryCreate,
        updateFieldValue,
    };
};

import { useMutation } from '@apollo/client/react';
import { useHelmet } from '@hooks/useHelmet';
import { Collection } from '@models/Collection.model';
import { initialisedCollection } from '@utilities/helper';
import { logError } from '@utilities/logError';
import { useEffect, useState } from 'react';

import {
    CreateCollectionResponse,
    CreateCollectionVariables,
    createCollectionMutation,
} from './queries/createCollectionMutation';

export type CollectionDetailAddProps = {
    moduleName: string;
};

export const useCollectionDetailAdd = (props: CollectionDetailAddProps) => {
    const helmet = useHelmet();

    useEffect(() => {
        helmet.setTitle('Uniformology: Add Collection');
    }, [helmet]);

    const [collection, setCollection] = useState<Collection>({
        ...initialisedCollection,
    });
    const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);

    const updateFieldValue = (field: string, value: string | number) => {
        setCollection((priorCollection: Collection) => ({
            ...priorCollection,
            [field]: value,
        }));
    };

    const [createCollection] = useMutation(createCollectionMutation);

    const tryCreate = async (): Promise<any> => {
        try {
            const response = await createCollection({
                variables: {
                    descriptionLong: collection.descriptionLong.trim(),
                    descriptionShort: collection.descriptionShort.trim(),
                    tagName: collection.tagName.trim(),
                    title: collection.title.trim(),
                },
            });
            return response.data?.createCollectionV2;
        } catch (error) {
            logError({
                moduleName: props.moduleName,
                name: 'tryCreate',
                exception: error,
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

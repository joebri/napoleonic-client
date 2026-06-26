import { useHelmet } from '@hooks/useHelmet';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { Template } from '@models/Template.model';
import { useHeaderTitleStateSet } from '@state';
import { useEffect, useState } from 'react';

const initialisedTemplate: Template = {
    artist: '',
    tags: '',
    urlRoot: '',
    yearFrom: '',
    yearTo: '',
};

export const useSettings = (moduleName: string) => {
    const helmet = useHelmet();

    const [templateLocalStorage, setTemplateLocalStorage] =
        useLocalStorage<Template>('template', initialisedTemplate);

    const setHeaderTitle = useHeaderTitleStateSet();

    const { clearHeaderNavigationTags } = useNavigationTags();

    const [template, setTemplate] = useState(templateLocalStorage);
    const [isMessageVisible, setIsMessageVisible] = useState(false);

    useEffect(() => {
        helmet.setTitle('Uniformology: Settings');
    }, [helmet]);

    useEffect(() => {
        setHeaderTitle('Settings');
        clearHeaderNavigationTags();
    }, [clearHeaderNavigationTags, setHeaderTitle]);

    const updateTemplateValue = (field: string, value: string) => {
        setTemplate((priorTemplate: Template) => ({
            ...priorTemplate,
            [field]: value,
        }));
    };

    const resetTemplate = () => {
        setTemplate(templateLocalStorage);
    };

    const tryTemplateSave = () => {
        const updatedTemplate: Template = {
            artist: template.artist.trim(),
            tags: template.tags.trim(),
            urlRoot: template.urlRoot.trim(),
            yearFrom: template.yearFrom.trim(),
            yearTo: template.yearTo.trim(),
        };
        setTemplate(updatedTemplate);
        setTemplateLocalStorage(updatedTemplate);

        setIsMessageVisible(true);
    };

    const hideMessage = () => {
        setIsMessageVisible(false);
    };

    return {
        hideMessage,
        isMessageVisible,
        resetTemplate,
        template,
        tryTemplateSave,
        updateTemplateValue,
    };
};

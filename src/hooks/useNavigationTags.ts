import { NavigationTagType } from '@enums/navigationTagType.enum';
import { FilterTag } from '@models/FilterTag.model';
import { useNavigationTagsState, useTagsStateGet } from '@state';
import { useCallback } from 'react';

export type HeaderNavigationTagsProps = {
    id: string;
    names: string[];
    tagType: NavigationTagType;
    title: string;
};

export const useNavigationTags = (): any => {
    const tags = useTagsStateGet();

    const [navigationTags, setNavigationTags] = useNavigationTagsState();

    const clearHeaderNavigationTags = useCallback(() => {
        setNavigationTags([]);
    }, [setNavigationTags]);

    const enableLastNavigationTag = useCallback(() => {
        let updated = [...navigationTags];
        let lastNavigationTag = updated.pop();
        if (lastNavigationTag && !lastNavigationTag.isNavigationTag) {
            updated.push({
                ...lastNavigationTag,
                isNavigationTag: true,
            });
            setNavigationTags(updated);
        }
    }, [navigationTags, setNavigationTags]);

    const setArtistsNavigationTags = useCallback(
        (artistNames: string[]) => {
            const artistNamesTitle = artistNames.join(' / ');
            const artistNamesQuery = artistNames.join('||');

            setNavigationTags([
                {
                    isNavigationTag: true,
                    title: 'Artists',
                    type: NavigationTagType.Artists,
                    url: '/artists',
                },
                {
                    isNavigationTag: false,
                    title: artistNamesTitle,
                    type: NavigationTagType.Artists,
                    url: `/gallery?artists=${artistNamesQuery}`,
                },
            ]);
        },
        [setNavigationTags]
    );

    const setBattlesNavigationTags = useCallback(
        (battleNames: string[]) => {
            const battleNamesTitle = battleNames.join(' / ');
            const battleNamesQuery = battleNames.join('||');

            setNavigationTags([
                {
                    isNavigationTag: true,
                    title: 'Battles',
                    type: NavigationTagType.Battles,
                    url: '/battles',
                },
                {
                    isNavigationTag: false,
                    title: battleNamesTitle,
                    type: NavigationTagType.Battles,
                    url: `/gallery?battles=${battleNamesQuery}`,
                },
            ]);
        },
        [setNavigationTags]
    );

    const setRegimentsNavigationTags = useCallback(
        (regimentNames: string[]) => {
            const regimentNamesTitle = regimentNames.join(' / ');
            const regimentNamesQuery = regimentNames.join('||');

            setNavigationTags([
                {
                    isNavigationTag: true,
                    title: 'Regiments',
                    type: NavigationTagType.Regiments,
                    url: '/regiments',
                },
                {
                    isNavigationTag: false,
                    title: regimentNamesTitle,
                    type: NavigationTagType.Regiments,
                    url: `/gallery/?regiments=${regimentNamesQuery}`,
                },
            ]);
        },
        [setNavigationTags]
    );

    const setCollectionNavigationTags = useCallback(
        (
            collectionId: string,
            collectionNames: string[],
            title: string | undefined
        ) => {
            const collectionNamesTitle = collectionNames.join(' / ');

            setNavigationTags([
                {
                    isNavigationTag: true,
                    name: collectionNamesTitle,
                    title: title || '',
                    type: NavigationTagType.Collection,
                    url: `/collectionDetailView/${collectionId}`,
                },
            ]);
        },
        [setNavigationTags]
    );

    const setCollectionsNavigationTags = useCallback(
        (collectionTitle: string) => {
            setNavigationTags([
                {
                    isNavigationTag: true,
                    title: 'Collections',
                    type: NavigationTagType.Collections,
                    url: '/collections',
                },
                {
                    isNavigationTag: false,
                    title: collectionTitle,
                    type: NavigationTagType.Collections,
                    url: '',
                },
            ]);
        },
        [setNavigationTags]
    );

    const setGalleryNavigationTags = useCallback(() => {
        const filterTagNames = tags
            .filter((tag: FilterTag) => {
                return tag.isSelected;
            })
            .map((tag: FilterTag) => tag.name)
            .join(', ');

        if (filterTagNames) {
            setNavigationTags([
                {
                    isNavigationTag: false,
                    title: filterTagNames,
                    type: NavigationTagType.Gallery,
                    url: '/gallery',
                },
            ]);
        } else {
            setNavigationTags([]);
        }
    }, [setNavigationTags, tags]);

    const setAllTagsNavigationTags = useCallback(
        (tagNames: string[]) => {
            const tagNamesTitle = tagNames.join(' / ');
            const tagNamesQuery = encodeURIComponent(tagNames.join('||'));

            setNavigationTags([
                {
                    isNavigationTag: true,
                    title: 'All Tags',
                    type: NavigationTagType.AllTags,
                    url: '/allTags',
                },
                {
                    isNavigationTag: false,
                    title: tagNamesTitle,
                    type: NavigationTagType.AllTags,
                    url: `/gallery?tags=${tagNamesQuery}`,
                },
            ]);
        },
        [setNavigationTags]
    );

    const setHeaderNavigationTags = useCallback(
        ({ id, names, tagType, title }: HeaderNavigationTagsProps) => {
            switch (tagType) {
                case NavigationTagType.Gallery:
                    setGalleryNavigationTags();
                    break;
                case NavigationTagType.Artists:
                    setArtistsNavigationTags(names);
                    break;
                case NavigationTagType.Battles:
                    setBattlesNavigationTags(names);
                    break;
                case NavigationTagType.Regiments:
                    setRegimentsNavigationTags(names);
                    break;
                case NavigationTagType.Collection:
                    setCollectionNavigationTags(id, names, title);
                    break;
                case NavigationTagType.Collections:
                    setCollectionsNavigationTags(names[0]);
                    break;
                case NavigationTagType.AllTags:
                    setAllTagsNavigationTags(names);
                    break;
            }
        },
        [
            setAllTagsNavigationTags,
            setArtistsNavigationTags,
            setBattlesNavigationTags,
            setCollectionNavigationTags,
            setCollectionsNavigationTags,
            setGalleryNavigationTags,
            setRegimentsNavigationTags,
        ]
    );

    return {
        clearHeaderNavigationTags,
        enableLastNavigationTag,
        setHeaderNavigationTags,
    };
};

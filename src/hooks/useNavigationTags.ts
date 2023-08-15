import { useCallback } from 'react';

import { NavigationTagType } from 'enums/navigationTagType.enum';
import { useNavigationTagsState, useTagsStateGet } from 'state';
import { Tag } from 'types';

interface HeaderNavigationTagsProps {
  id: string;
  names: string[];
  tagType: NavigationTagType;
  title: string;
}

const useNavigationTags = (): any => {
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
          type: NavigationTagType.ARTISTS,
          url: '/artists',
        },
        {
          isNavigationTag: false,
          title: artistNamesTitle,
          type: NavigationTagType.ARTISTS,
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
          type: NavigationTagType.BATTLES,
          url: '/battles',
        },
        {
          isNavigationTag: false,
          title: battleNamesTitle,
          type: NavigationTagType.BATTLES,
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
          type: NavigationTagType.REGIMENTS,
          url: '/regiments',
        },
        {
          isNavigationTag: false,
          title: regimentNamesTitle,
          type: NavigationTagType.REGIMENTS,
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
          type: NavigationTagType.COLLECTION,
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
          type: NavigationTagType.COLLECTIONS,
          url: '/collections',
        },
        {
          isNavigationTag: false,
          title: collectionTitle,
          type: NavigationTagType.COLLECTIONS,
          url: '',
        },
      ]);
    },
    [setNavigationTags]
  );

  const setGalleryNavigationTags = useCallback(() => {
    const tagNames = tags
      .filter((tag: Tag) => {
        return tag.isSelected;
      })
      .map((tag: Tag) => tag.name)
      .join(', ');

    if (tagNames) {
      setNavigationTags([
        {
          isNavigationTag: false,
          title: tagNames,
          type: NavigationTagType.GALLERY,
          url: '/gallery',
        },
      ]);
    } else {
      setNavigationTags([]);
    }
  }, [setNavigationTags, tags]);

  const setHeaderNavigationTags = useCallback(
    ({ id, names, tagType, title }: HeaderNavigationTagsProps) => {
      switch (tagType) {
        case NavigationTagType.GALLERY:
          setGalleryNavigationTags();
          break;
        case NavigationTagType.ARTISTS:
          setArtistsNavigationTags(names);
          break;
        case NavigationTagType.BATTLES:
          setBattlesNavigationTags(names);
          break;
        case NavigationTagType.REGIMENTS:
          setRegimentsNavigationTags(names);
          break;
        case NavigationTagType.COLLECTION:
          setCollectionNavigationTags(id, names, title);
          break;
        case NavigationTagType.COLLECTIONS:
          setCollectionsNavigationTags(names[0]);
          break;
      }
    },
    [
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

export { type HeaderNavigationTagsProps, useNavigationTags };

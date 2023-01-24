import { NavigationTagType } from 'enums/navigationTagType.enum';
import { useAppContext } from 'AppContext';
import { useCallback } from 'react';
import { Tag } from 'types';

const useNavigationTags = (): any => {
  const { navigationTags, setNavigationTags, tags } = useAppContext();

  const clearHeaderNavigationTags = useCallback(() => {
    setNavigationTags([]);
  }, [setNavigationTags]);

  const enableLastNavigationTag = useCallback(() => {
    let updated = [...navigationTags];
    const lastNavigationTag = updated.at(-1);
    if (lastNavigationTag) {
      lastNavigationTag.isNavigationTag = true;
      setNavigationTags(updated);
    }
  }, [navigationTags, setNavigationTags]);

  const setArtistsNavigationTags = useCallback(
    (artistNames: string[]) => {
      const artistNamesTitle = artistNames.join(' / ');
      const artistNamesQuery = artistNames.join('||');

      setNavigationTags([
        {
          type: NavigationTagType.ARTISTS,
          title: 'Artists',
          url: '/artists',
          isNavigationTag: true,
        },
        {
          type: NavigationTagType.ARTISTS,
          title: artistNamesTitle,
          url: `/?artists=${artistNamesQuery}`,
          isNavigationTag: false,
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
          type: NavigationTagType.BATTLES,
          title: 'Battles',
          url: '/battles',
          isNavigationTag: true,
        },
        {
          type: NavigationTagType.BATTLES,
          title: battleNamesTitle,
          url: `/?battles=${battleNamesQuery}`,
          isNavigationTag: false,
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
          type: NavigationTagType.REGIMENTS,
          title: 'Regiments',
          url: '/regiments',
          isNavigationTag: true,
        },
        {
          type: NavigationTagType.REGIMENTS,
          title: regimentNamesTitle,
          url: `/?regiments=${regimentNamesQuery}`,
          isNavigationTag: false,
        },
      ]);
    },
    [setNavigationTags]
  );

  const setCollectionNavigationTags = useCallback(
    (collectionNames: string[], collectionId: string) => {
      const collectionNamesTitle = collectionNames.join(' / ');

      setNavigationTags([
        {
          type: NavigationTagType.COLLECTION,
          title: collectionNamesTitle,
          isNavigationTag: true,
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
          type: NavigationTagType.COLLECTIONS,
          title: 'Collections',
          isNavigationTag: true,
          url: '/collections',
        },
        {
          type: NavigationTagType.COLLECTIONS,
          title: collectionTitle,
          isNavigationTag: false,
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
          type: NavigationTagType.GALLERY,
          title: tagNames,
          url: '/',
          isNavigationTag: false,
        },
      ]);
    } else {
      setNavigationTags([]);
    }
  }, [setNavigationTags, tags]);

  const setHeaderNavigationTags = useCallback(
    (tagType: NavigationTagType, names: string[], id: string) => {
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
          setCollectionNavigationTags(names, id);
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

export { useNavigationTags };

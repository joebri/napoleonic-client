import { useLazyQuery } from '@apollo/client';
import {
  ChangeEvent,
  KeyboardEvent,
  LegacyRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { NavigationTagType } from 'enums/navigationTagType.enum';
import {
  HeaderNavigationTagsProps,
  useNavigationTags,
} from 'hooks/useNavigationTags';
import {
  useHeaderTitleStateSet,
  useIncludeUnknownYearStateGet,
  usePageNumberState,
  useRatingsStateGet,
  useSortFieldStateGet,
  useTagsStateGet,
  useYearRangeStateGet,
} from 'state';
import { Item } from 'types';
import { ratingsToArray } from 'utilities/helper';
import { logError } from 'utilities/logError';
import { readItemsByFilterQuery } from './queries/readItemsByFilterQuery';
import {
  buildArtistsQueryParams,
  buildBattlesQueryParams,
  buildCollectionsQueryParams,
  buildRegimentsQueryParams,
  buildTagsQueryParams,
} from './queryBuilder';

import { LoadStatus } from 'enums/loadStatus.enum';

const PAGE_SIZE = 20;

const useGallery = (moduleName: string) => {
  const setHeaderTitle = useHeaderTitleStateSet();
  const [pageNumber, setPageNumber] = usePageNumberState();
  const includeUnknownYear = useIncludeUnknownYearStateGet();
  const ratings = useRatingsStateGet();
  const sortField = useSortFieldStateGet();
  const tags = useTagsStateGet();
  const yearRange = useYearRangeStateGet();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [pageCount, setPageCount] = useState(1);
  const [requestedPageNumber, setRequestedPageNumber] = useState('');

  const [searchParams] = useSearchParams();

  const itemsRef: MutableRefObject<Item[]> = useRef<Item[]>([]);
  const wrapperRef: LegacyRef<HTMLDivElement> | undefined = useRef(null);

  const { setHeaderNavigationTags } = useNavigationTags();

  const tryGetArtistsQuery = useCallback(
    (selectedRatings: number[]) => {
      const queryArtists = searchParams.get('artists');

      if (queryArtists) {
        const artistNames = queryArtists.split('||');

        setHeaderNavigationTags({
          id: '',
          names: artistNames,
          tagType: NavigationTagType.ARTISTS,
          title: artistNames.join(' / '),
        } as HeaderNavigationTagsProps);

        return buildArtistsQueryParams({
          includeUnknownYear,
          queryArtists,
          selectedRatings,
          tags,
          yearRange,
        });
      }
    },
    [includeUnknownYear, searchParams, setHeaderNavigationTags, tags, yearRange]
  );

  const tryGetBattlesQuery = useCallback(
    (selectedRatings: number[]) => {
      const queryBattles = searchParams.get('battles');
      if (queryBattles) {
        const battleNames = queryBattles.split('||');

        setHeaderNavigationTags({
          id: '',
          names: battleNames,
          tagType: NavigationTagType.BATTLES,
          title: battleNames.join(' / '),
        } as HeaderNavigationTagsProps);

        return buildBattlesQueryParams(queryBattles, selectedRatings);
      }
    },
    [searchParams, setHeaderNavigationTags]
  );

  const tryGetRegimentsQuery = useCallback(
    (selectedRatings: number[]) => {
      const queryRegiments = searchParams.get('regiments');
      if (queryRegiments) {
        const regimentNames = queryRegiments.split('||');

        setHeaderNavigationTags({
          id: '',
          names: regimentNames,
          tagType: NavigationTagType.REGIMENTS,
          title: regimentNames.join(' / '),
        } as HeaderNavigationTagsProps);

        return buildRegimentsQueryParams({
          includeUnknownYear,
          queryRegiments,
          selectedRatings,
          tags,
        });
      }
    },
    [includeUnknownYear, searchParams, setHeaderNavigationTags, tags]
  );

  const tryGetCollectionQuery = useCallback(
    (selectedRatings: number[]) => {
      const queryCollection = searchParams.get('collection');
      const queryTags = searchParams.get('tags');
      if (queryCollection) {
        const queryCollectionData = queryCollection.split('||');

        setHeaderNavigationTags({
          id: queryCollectionData[2],
          names: [queryCollectionData[0]],
          tagType: NavigationTagType.COLLECTION,
          title: queryCollectionData[1],
        } as HeaderNavigationTagsProps);

        return buildCollectionsQueryParams(
          queryCollectionData[0],
          queryTags,
          selectedRatings
        );
      }
    },
    [searchParams, setHeaderNavigationTags]
  );

  const tryGetStandardQuery = useCallback(
    (selectedRatings: number[]) => {
      setHeaderNavigationTags({
        id: '',
        names: [],
        tagType: NavigationTagType.GALLERY,
        title: '',
      } as HeaderNavigationTagsProps);

      const queryTags = searchParams.get('tags');

      const queryParams = buildTagsQueryParams({
        queryTags,
        tags,
        selectedRatings,
        yearRange,
        includeUnknownYear,
      });

      if (queryParams.tagNames.length > 0) {
        return queryParams;
      }
    },
    [includeUnknownYear, searchParams, setHeaderNavigationTags, tags, yearRange]
  );

  const getQueryDetails = useCallback(() => {
    const selectedRatings = ratingsToArray(ratings);

    const artistsQuery = tryGetArtistsQuery(selectedRatings);
    if (artistsQuery) {
      return artistsQuery;
    }

    const battlesQuery = tryGetBattlesQuery(selectedRatings);
    if (battlesQuery) {
      return battlesQuery;
    }

    const regimentsQuery = tryGetRegimentsQuery(selectedRatings);
    if (regimentsQuery) {
      return regimentsQuery;
    }

    const collectionQuery = tryGetCollectionQuery(selectedRatings);
    if (collectionQuery) {
      return collectionQuery;
    }

    const standardQuery = tryGetStandardQuery(selectedRatings);
    if (standardQuery) {
      return standardQuery;
    }
  }, [
    ratings,
    tryGetArtistsQuery,
    tryGetBattlesQuery,
    tryGetCollectionQuery,
    tryGetRegimentsQuery,
    tryGetStandardQuery,
  ]);

  const [readItemsByFilter, { error }] = useLazyQuery(readItemsByFilterQuery, {
    onCompleted: (data) => {
      itemsRef.current = data.readItemsByFilter.items;
      const pageCount = Math.ceil(data.readItemsByFilter.count / PAGE_SIZE);
      setPageCount(pageCount);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({
        moduleName,
        name: 'readItemsByFilter',
        exception,
        ratings,
        sortField,
        tags,
        pageNumber,
      });
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    setHeaderTitle('Gallery');
  });

  useEffect(() => {
    const loadForm = (pageNumber: number) => {
      setLoadStatus(LoadStatus.LOADING);
      const queryDetails = getQueryDetails();

      if (!queryDetails) {
        itemsRef.current = [];
        setPageCount(0);
        setLoadStatus(LoadStatus.LOADED);
        return;
      }
      readItemsByFilter({
        variables: {
          artists: queryDetails.artists,
          battles: queryDetails.battles,
          pageNumber,
          pageSize: PAGE_SIZE,
          ratings: queryDetails.ratings,
          regiments: queryDetails.regiments,
          sort: sortField,
          sortSequence: 'asc',
          tags: queryDetails.tagNames,
          yearRange: queryDetails.yearRange,
          includeUnknownYear: queryDetails.includeUnknownYear,
        },
      });
    };

    loadForm(pageNumber);
    document.getElementById('scrollableView')?.scrollTo({ top: 0 });
  }, [getQueryDetails, pageNumber, readItemsByFilter, sortField, tags]);

  const handlePaginationChange = (
    _: ChangeEvent<unknown>,
    newPageNumber: number
  ) => {
    setPageNumber(newPageNumber);
  };

  const handlePageNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRequestedPageNumber(event.target.value);
  };

  const handlePageNumberKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter') {
      let pageNumber = parseInt(requestedPageNumber);
      if (pageNumber > pageCount) {
        pageNumber = pageCount;
      }
      if (pageNumber < 1) {
        pageNumber = 1;
      }
      setRequestedPageNumber('');
      setPageNumber(pageNumber);
      wrapperRef.current?.focus();
    }
  };

  return {
    error,
    handlePageNumberChange,
    handlePageNumberKeyDown,
    handlePaginationChange,
    itemsRef,
    loadStatus,
    pageCount,
    pageNumber,
    requestedPageNumber,
    wrapperRef,
  };
};

export { useGallery };

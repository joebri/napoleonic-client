/** @jsxImportSource @emotion/react */

import { useLazyQuery } from '@apollo/client';
import { Stack, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
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
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { ItemCardList } from 'components/ItemCardList/ItemCardList';
import { Loading } from 'components/Loading/Loading';
import { classes } from './Gallery.style';

import { LoadStatus } from 'enums/loadStatus.enum';
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

const PAGE_SIZE = 20;

const Gallery = () => {
  const moduleName = `${Gallery.name}.tsx`;

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

  //TODO this is too long!
  const getQueryDetails = useCallback(() => {
    const selectedRatings = ratingsToArray(ratings);

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

    // otherwise perform standard search
    setHeaderNavigationTags({
      id: '',
      names: [],
      tagType: NavigationTagType.GALLERY,
      title: '',
    } as HeaderNavigationTagsProps);

    const queryParams = buildTagsQueryParams({
      queryTags,
      tags,
      selectedRatings,
      yearRange,
      includeUnknownYear,
    });
    return queryParams.tagNames.length === 0 ? null : queryParams;
  }, [
    includeUnknownYear,
    setHeaderNavigationTags,
    ratings,
    searchParams,
    tags,
    yearRange,
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

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <ErrorHandler error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Uniformology: Gallery</title>
      </Helmet>
      <div css={classes.wrapper} ref={wrapperRef} tabIndex={0}>
        <div id="scrollableView" css={classes.div1}>
          <ItemCardList items={itemsRef.current}></ItemCardList>
        </div>
        {pageCount > 0 && (
          <Stack direction={'row'} justifyContent="center" gap={4}>
            <Pagination
              count={pageCount}
              css={classes.pager}
              onChange={handlePaginationChange}
              page={pageNumber}
              shape="rounded"
              variant="outlined"
            />
            <TextField
              css={classes.pageNumber}
              type="number"
              size="small"
              value={requestedPageNumber}
              onChange={handlePageNumberChange}
              onKeyDown={handlePageNumberKeyDown}
              variant="outlined"
            />
          </Stack>
        )}
      </div>
    </>
  );
};

export { Gallery };

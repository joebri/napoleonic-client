/** @jsxImportSource @emotion/react */

import { ChangeEvent, KeyboardEvent, LegacyRef, MutableRefObject } from 'react';
import { Helmet } from 'react-helmet-async';
import { Stack, TextField } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

import { classes } from './Gallery.style';
import { Error } from 'components/Error/Error';
import { ItemCardList } from 'components/ItemCardList/ItemCardList';
import { Loading } from 'components/Loading/Loading';

import { Item } from 'types';
import { LoadStatus } from 'enums/loadStatus.enum';
import { ratingsToArray } from 'helper';
import { useAppContext } from 'AppContext';
import { useLogError } from 'hooks/useLogError';
import readItemsByFilterQuery from './queries/readItemsByFilterQuery';
import {
  buildArtistsQueryParams,
  buildBattlesQueryParams,
  buildCollectionsQueryParams,
  buildRegimentsQueryParams,
  buildTagsQueryParams,
} from './queryBuilder';

const PAGE_SIZE = 20;

const Gallery = () => {
  const {
    ratings,
    sortField,
    tags,
    pageNumber,
    setPageNumber,
    yearRange,
    // includeUnknownYear,
  } = useAppContext();
  const { logError } = useLogError(Gallery.name);

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [pageCount, setPageCount] = useState(1);
  const [requestedPageNumber, setRequestedPageNumber] = useState('');

  const [searchParams] = useSearchParams();

  const itemsRef: MutableRefObject<Item[]> = useRef<Item[]>([]);
  const wrapperRef: LegacyRef<HTMLDivElement> | undefined = useRef(null);

  const cachedGetQueryDetails = useCallback(() => {
    const selectedRatings = ratingsToArray(ratings);

    const queryArtists = searchParams.get('artists');
    if (queryArtists) {
      return buildArtistsQueryParams(
        queryArtists,
        tags,
        selectedRatings,
        yearRange
      );
    }

    const queryBattles = searchParams.get('battles');
    if (queryBattles) {
      return buildBattlesQueryParams(queryBattles, selectedRatings);
    }

    const queryRegiments = searchParams.get('regiments');
    if (queryRegiments) {
      return buildRegimentsQueryParams(queryRegiments, tags, selectedRatings);
    }

    const queryCollection = searchParams.get('collection');
    const queryTags = searchParams.get('tags');
    if (queryCollection) {
      return buildCollectionsQueryParams(
        queryCollection,
        queryTags,
        selectedRatings
      );
    }

    return buildTagsQueryParams(queryTags, tags, selectedRatings, yearRange);
  }, [ratings, searchParams, tags, yearRange]);

  const [readItemsByFilter, { error }] = useLazyQuery(readItemsByFilterQuery, {
    onCompleted: (data) => {
      itemsRef.current = data.readItemsByFilter.items;
      const pageCount = Math.ceil(data.readItemsByFilter.count / PAGE_SIZE);
      setPageCount(pageCount);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({
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
    const loadForm = (pageNumber: number) => {
      const queryDetails = cachedGetQueryDetails();
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
  }, [cachedGetQueryDetails, pageNumber, readItemsByFilter, sortField, tags]);

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
    return <Error error={error} />;
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
      </div>
    </>
  );
};

export { Gallery };

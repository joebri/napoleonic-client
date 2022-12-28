/** @jsxImportSource @emotion/react */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChangeEvent } from 'react';
import { Stack, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useLazyQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import _debounce from 'lodash/debounce';
import _isEqual from 'lodash/isEqual';

import { classes } from './Gallery.style';
import { useAppContext } from '../../AppContext';
import { ItemCardList } from '../../components/ItemCardList/ItemCardList';
import { Tag } from '../../types/Tag.type';
import readItemsByTagsQuery from './queries/readItemsByTagsQuery';
import { LoadStatus } from '../../enums/loadStatus.enum';

const PAGE_SIZE = 20;

const Gallery = () => {
  const { ratings, sortField, tags, setTags, pageNumber, setPageNumber } =
    useAppContext();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [pageCount, setPageCount] = useState(1);
  const [requestedPageNumber, setRequestedPageNumber] = useState('');

  const [searchParams] = useSearchParams();

  const itemsRef: any = useRef([]);
  const errorRef: any = useRef();
  const wrapperRef: any = useRef(null);

  const cachedGetQueryDetails = useCallback(() => {
    const queryArtists = searchParams.get('artists');
    const queryBattles = searchParams.get('battles');
    const queryRegiments = searchParams.get('regiments');
    const queryCollection = searchParams.get('collection');
    const queryTags = searchParams.get('tags');

    const selectedRatings = [];
    if (ratings.high) {
      selectedRatings.push(1);
    }
    if (ratings.medium) {
      selectedRatings.push(3);
    }
    if (ratings.low) {
      selectedRatings.push(5);
    }

    if (queryArtists) {
      const artists = queryArtists.split('||');
      const tagNames = tags
        .filter((tag: Tag) => {
          return tag.isSelected === true;
        })
        .map((tag: Tag) => tag.name);
      return {
        type: 'artists',
        artists,
        ratings: selectedRatings,
        regiments: [],
        tagNames,
      };
    }

    if (queryBattles) {
      const battles = queryBattles.split('||');
      return {
        type: 'battles',
        artists: [],
        battles,
        ratings,
        regiments: [],
        tagNames: [],
      };
    }

    if (queryRegiments) {
      const regiments = queryRegiments.split('||');
      const tagNames = tags
        .filter((tag: Tag) => {
          return tag.isSelected === true;
        })
        .map((tag: Tag) => tag.name);
      return {
        type: 'regiments',
        artists: [],
        ratings: selectedRatings,
        regiments,
        tagNames,
      };
    }

    if (queryCollection) {
      const collectionItemId = queryCollection;
      const tagNames = queryTags?.split(',') || [];

      const collectionName = tags
        .filter((tag: Tag) => {
          return tag.group === 'Collection';
        })
        .filter((tag: Tag) => {
          return tag.itemId === collectionItemId;
        })[0].name;

      const updatedTags = tags.map((tag: Tag) => {
        return {
          ...tag,
          isSelected: tag.itemId === collectionItemId,
        };
      });

      if (!_isEqual(updatedTags, tags)) {
        setTags(updatedTags);
      }

      return {
        type: 'tags',
        artists: [],
        ratings: selectedRatings,
        regiments: [],
        tagNames: [...tagNames, collectionName],
      };
    }

    let tagNames: string[] = [];
    if (queryTags) {
      tagNames = queryTags.split(',');
    } else {
      tagNames = tags
        .filter((tag: Tag) => {
          return tag.isSelected === true;
        })
        .map((tag: Tag) => tag.name);
    }
    return {
      type: 'tags',
      artists: [],
      ratings: selectedRatings,
      regiments: [],
      tagNames,
    };
  }, [ratings, searchParams, setTags, tags]);

  const [readItemsByTags] = useLazyQuery(readItemsByTagsQuery, {
    onCompleted: (data) => {
      itemsRef.current = data.readItemsByTags.items;
      const pageCount = Math.ceil(data.readItemsByTags.count / PAGE_SIZE);
      setPageCount(pageCount);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      console.error(exception);
      errorRef.current = exception;
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    const loadForm = (pageNumber: number) => {
      const queryDetails = cachedGetQueryDetails();
      console.log('queryDetails', queryDetails);
      readItemsByTags({
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
        },
      });
    };

    loadForm(pageNumber);
    document.getElementById('scrollableView')?.scrollTo({ top: 0 });
  }, [cachedGetQueryDetails, pageNumber, readItemsByTags, sortField, tags]);

  const handlePaginationChange = (
    _: ChangeEvent<unknown>,
    newPageNumber: number
  ) => {
    setPageNumber(newPageNumber);
  };

  const handlePageNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRequestedPageNumber(event.target.value);
  };

  const handlePageNumberKeyDown = (event: any) => {
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
      wrapperRef.current.focus();
    }
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading..</p>;
  if (loadStatus === LoadStatus.ERROR) {
    return <p>`Error: ${JSON.stringify(errorRef.current)}`</p>;
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

/** @jsxImportSource @emotion/react */

import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { Stack, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useLazyQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import _debounce from 'lodash/debounce';
import _isEqual from 'lodash/isEqual';

import { classes } from './Gallery.style';
import { useAppContext } from '../../AppContext';
import { ItemCardList } from '../../components/ItemCardList';
import { Tag } from '../../types/Tag.type';
// import readItemsByArtistsQuery from './queries/readItemsByArtistsQuery';
// import readItemsByRegimentsQuery from './queries/readItemsByRegimentsQuery';
import readItemsByTagsQuery from './queries/readItemsByTagsQuery';
import { LoadStatus } from '../../enums/loadStatus.enum';

const PAGE_SIZE = 20;

const Gallery = () => {
  const { sortField, tags, setTags, pageNumber, setPageNumber } =
    useAppContext();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [pageCount, setPageCount] = useState(1);
  const [requestedPageNumber, setRequestedPageNumber] = useState('');

  const [searchParams] = useSearchParams();

  const itemsRef: any = useRef([]);
  const errorRef: any = useRef();
  const wrapperRef: any = useRef(null);

  const getQueryDetails = () => {
    const queryArtists = searchParams.get('artists');
    const queryBattles = searchParams.get('battles');
    const queryRegiments = searchParams.get('regiments');
    const queryCollection = searchParams.get('collection');
    const queryTags = searchParams.get('tags');

    if (queryArtists) {
      const artists = queryArtists.split('||');
      return { type: 'artists', artists, regiments: [], tagNames: [] };
    }

    if (queryBattles) {
      const battles = queryBattles.split('||');
      return {
        type: 'battles',
        artists: [],
        battles,
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
      return { type: 'regiments', artists: [], regiments, tagNames };
    }

    if (queryCollection) {
      const collectionItemId = queryCollection;
      const tagNames = queryTags?.split(',') || [];
      console.log('collectionItemId', collectionItemId);
      console.log('tags', tags);

      const collectionName = tags
        .filter((tag: Tag) => {
          return tag.group === 'Collection';
        })
        .filter((tag: Tag) => {
          // console.log(`tag.itemId >${tag.itemId}<, >${collectionItemId}<`);
          return tag.itemId === collectionItemId;
        })[0].name;
      console.log('collectionName', collectionName);

      const updatedTags = tags.map((tag: Tag) => {
        return {
          ...tag,
          isSelected: tag.itemId == collectionItemId,
        };
      });

      if (!_isEqual(updatedTags, tags)) {
        console.log('Gallery:updatedTags', updatedTags);
        setTags(updatedTags);
      }

      return {
        type: 'tags',
        artists: [],
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
    return { type: 'tags', artists: [], regiments: [], tagNames };
  };

  // useEffect(() => {
  //   loadForm(pageNumber);
  // }, []);

  useEffect(() => {
    loadForm(pageNumber);
    document.getElementById('scrollableView')?.scrollTo({ top: 0 });
  }, [pageNumber, sortField, tags]); // tags TODO fix

  const [readItemsByTags, {}] = useLazyQuery(readItemsByTagsQuery, {
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

  const loadForm = (pageNumber: number) => {
    const queryDetails = getQueryDetails();
    readItemsByTags({
      variables: {
        artists: queryDetails.artists,
        battles: queryDetails.battles,
        pageNumber,
        pageSize: PAGE_SIZE,
        regiments: queryDetails.regiments,
        sort: sortField,
        sortSequence: 'asc',
        tags: queryDetails.tagNames,
      },
    });
  };

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
  );
};

export { Gallery };

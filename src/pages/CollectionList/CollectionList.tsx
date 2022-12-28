/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { Helmet } from 'react-helmet';

import { classes } from './CollectionList.style';
import { LoadStatus } from '../../enums/loadStatus.enum';
import readCollectionsQuery from './queries/readCollectionsQuery';
import { Collection } from '../../types/Collection.type';

const CollectionList = () => {
  const navigate = useNavigate();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [collections, setCollections] = useState([] as Collection[]);

  const errorRef: any = useRef();

  useEffect(() => {
    readCollections();
  }, []);

  const [readCollections, {}] = useLazyQuery(readCollectionsQuery, {
    onCompleted: (data) => {
      setCollections(data.readCollections);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      console.error(exception);
      errorRef.current = exception;
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const handleSearchClick = (collection: Collection) => {
    navigate(`/collectionDetailView/${collection.itemId}`);
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading..</p>;
  if (loadStatus === LoadStatus.ERROR)
    return <p>`Error: ${JSON.stringify(errorRef.current)}`</p>;

  return (
    <>
      <Helmet>
        <title>Uniformology: Collections</title>
      </Helmet>
      <div css={classes.container}>
        <Typography variant="h4" css={classes.title}>
          Collections
        </Typography>
        <Stack direction={'row'} gap={1} sx={{ flexWrap: 'wrap' }}>
          {collections.map((collection: Collection, index: number) => (
            <Button
              css={classes.button}
              key={index}
              onClick={() => {
                handleSearchClick(collection);
              }}
              variant="contained"
            >
              {`${collection.name}`}
            </Button>
          ))}
        </Stack>
      </div>
    </>
  );
};

export { CollectionList };

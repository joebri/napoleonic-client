/** @jsxImportSource @emotion/react */

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { useLazyQuery } from '@apollo/client';

import { classes } from './CollectionList.style';
import { Error } from 'components/Error/Error';
import { Loading } from 'components/Loading/Loading';

import { Collection } from 'types';
import { LoadStatus } from 'enums/loadStatus.enum';
import { useLogError } from 'hooks/useLogError';
import readCollectionsQuery from './queries/readCollectionsQuery';

const CollectionList = () => {
  const navigate = useNavigate();
  const { logError } = useLogError(CollectionList.name);

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [collections, setCollections] = useState([] as Collection[]);

  const [readCollections, { error }] = useLazyQuery(readCollectionsQuery, {
    onCompleted: (data) => {
      setCollections(data.readCollections);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({ name: 'readCollections', exception });
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    readCollections();
  }, [readCollections]);

  const handleSearchClick = (collection: Collection) => {
    navigate(`/collectionDetailView/${collection.id}`);
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
              {`${collection.tagName}`}
            </Button>
          ))}
        </Stack>
      </div>
    </>
  );
};

export { CollectionList };

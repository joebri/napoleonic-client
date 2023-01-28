/** @jsxImportSource @emotion/react */

import { useLazyQuery } from '@apollo/client';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { Error } from 'components/Error/Error';
import { Loading } from 'components/Loading/Loading';
import { classes } from './CollectionList.style';

import { useAppContext } from 'AppContext';
import { LoadStatus } from 'enums/loadStatus.enum';
import { useLogError } from 'hooks/useLogError';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { Collection } from 'types';
import { readCollectionsQuery } from './queries/readCollectionsQuery';

const CollectionList = () => {
  const navigate = useNavigate();
  const { logError } = useLogError(CollectionList.name);

  const { setHeaderTitle } = useAppContext();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [collections, setCollections] = useState([] as Collection[]);

  const { clearHeaderNavigationTags } = useNavigationTags();

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
    setHeaderTitle('Collections');
    clearHeaderNavigationTags();
  }, [clearHeaderNavigationTags, setHeaderTitle]);

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
        {collections.map((collection: Collection, index: number) => (
          <Button
            key={index}
            onClick={() => {
              handleSearchClick(collection);
            }}
            title={collection.title}
            variant="contained"
          >
            {`${collection.tagName}`}
          </Button>
        ))}
      </div>
    </>
  );
};

export { CollectionList };

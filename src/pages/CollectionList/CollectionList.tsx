/** @jsxImportSource @emotion/react */

import { Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { classes } from './CollectionList.style';
import { Error } from 'components/Error/Error';
import { Loading } from 'components/Loading/Loading';

import { Collection } from 'types';
import { LoadStatus } from 'enums/loadStatus.enum';
import { useAppContext } from 'AppContext';
import { useLogError } from 'hooks/useLogError';
import { useNavigationTags } from 'hooks/useNavigationTags';
import readCollectionsQuery from './queries/readCollectionsQuery';

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

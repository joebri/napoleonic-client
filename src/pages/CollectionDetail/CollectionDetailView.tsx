/** @jsxImportSource @emotion/react */

import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ConfirmDeleteDialog } from 'components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { Error } from 'components/Error/Error';
import { Loading } from 'components/Loading/Loading';
import { classes } from './CollectionDetail.style';

import { useAppContext } from 'AppContext';
import { LoadStatus } from 'enums/loadStatus.enum';
import { NavigationTagType } from 'enums/navigationTagType.enum';
import { useLogError } from 'hooks/useLogError';
import {
  HeaderNavigationTagsProps,
  useNavigationTags,
} from 'hooks/useNavigationTags';
import { initialisedCollection } from 'utilities/helper';
import { deleteCollectionMutation } from './queries/deleteCollectionMutation';
import { readCollectionQuery } from './queries/readCollectionQuery';
import { View } from './View';

const CollectionDetailView = () => {
  let { collectionId } = useParams();
  const navigate = useNavigate();
  const { logError } = useLogError(CollectionDetailView.name);

  const EDIT_PAGE_URI = `/collectionDetailEdit/${collectionId}`;

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [collection, setCollection] = useState(initialisedCollection);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const { setHeaderTitle } = useAppContext();
  const { setHeaderNavigationTags } = useNavigationTags();

  const [readCollection, { error }] = useLazyQuery(readCollectionQuery, {
    variables: { id: collectionId },
    onCompleted: (data) => {
      setCollection(data.readCollection);

      setHeaderNavigationTags({
        id: '',
        names: [data.readCollection.title],
        tagType: NavigationTagType.COLLECTIONS,
        title: data.readCollection.title,
      } as HeaderNavigationTagsProps);

      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({ name: 'readCollection', exception, collectionId });
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const [deleteCollection] = useMutation(deleteCollectionMutation);

  useEffect(() => {
    setHeaderTitle('Collection');
  }, [setHeaderTitle]);

  useEffect(() => {
    const loadForm = () => {
      setLoadStatus(LoadStatus.LOADING);
      readCollection();
    };

    loadForm();
  }, [collectionId, readCollection]);

  const handleEditClick = () => {
    navigate(EDIT_PAGE_URI);
  };

  const handleDeleteClick = () => {
    setShowConfirmDeleteDialog(true);
  };

  const handleDeleteCancelled = () => {
    setShowConfirmDeleteDialog(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteCollection({
        variables: {
          id: collectionId,
        },
      });
      navigate(`/`);
    } catch (exception) {
      logError({
        name: 'handleDeleteConfirmed',
        exception,
        message: 'Delete failed.',
        collectionId,
      });
      setShowConfirmDeleteDialog(false);
      setShowMessage(true);
    }
  };

  const handleMessageClose = () => {
    setShowMessage(false);
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
        <title>Uniformology: Collection</title>
      </Helmet>
      <div css={classes.container}>
        <View
          collection={collection}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
        />
      </div>

      <ConfirmDeleteDialog
        isOpen={showConfirmDeleteDialog}
        onClose={handleDeleteCancelled}
        onDeleteConfirmed={handleDeleteConfirmed}
      />

      <AppSnackBar
        message="Unable to delete collection. Please try again."
        onClose={handleMessageClose}
        open={showMessage}
      ></AppSnackBar>
    </>
  );
};

export { CollectionDetailView };

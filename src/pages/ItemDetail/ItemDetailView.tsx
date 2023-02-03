/** @jsxImportSource @emotion/react */

import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ConfirmDeleteDialog } from 'components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { classes } from './ItemDetail.style';
import { View } from './View';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useLogError } from 'hooks/useLogError';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { initialisedItem } from 'utilities/helper';
import { deleteItemMutation } from './queries/deleteItemMutation';
import { readItemQuery } from './queries/readItemQuery';

const ItemDetailView = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { logError } = useLogError(`${ItemDetailView.name}.tsx`);

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [item, setItem] = useState(initialisedItem);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const { enableLastNavigationTag } = useNavigationTags();

  const [deleteItem] = useMutation(deleteItemMutation);

  const [readItem, { error }] = useLazyQuery(readItemQuery, {
    variables: { id: itemId },
    onCompleted: (data) => {
      setItem(data.readItem);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({ name: 'readItem', exception, itemId });
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    enableLastNavigationTag();
  }, [enableLastNavigationTag]);

  useEffect(() => {
    const loadForm = () => {
      setLoadStatus(LoadStatus.LOADING);
      readItem();
    };

    loadForm();
  }, [itemId, readItem]);

  const handleEditClick = () => {
    navigate(`/itemDetailEdit/${itemId}`);
  };

  const handleDeleteClick = () => {
    setShowConfirmDeleteDialog(true);
  };

  const handleDeleteCancelled = () => {
    setShowConfirmDeleteDialog(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteItem({
        variables: {
          id: itemId,
        },
      });
      navigate(`/`);
    } catch (exception) {
      logError({
        name: 'handleDeleteConfirmed',
        exception,
        message: 'Delete failed.',
        itemId,
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
    return <ErrorHandler error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Uniformology: Item</title>
      </Helmet>
      <div css={classes.container}>
        <View
          item={item}
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
        message="Unable to delete item. Please try again."
        onClose={handleMessageClose}
        open={showMessage}
      ></AppSnackBar>
    </>
  );
};

export { ItemDetailView };

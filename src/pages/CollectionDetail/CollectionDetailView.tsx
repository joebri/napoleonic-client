/** @jsxImportSource @emotion/react */

import * as React from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';

import { classes } from './CollectionDetail.style';
import readItemQuery from './queries/readItemQuery';
import deleteItemMutation from './queries/deleteItemMutation';
import { View } from './View';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { LoadStatus } from '../../enums/loadStatus.enum';
import { initialisedItem } from '../../helper';

const CollectionDetailView = () => {
  let { itemId } = useParams();
  const EDIT_PAGE_URI = `/collectionDetailEdit/${itemId}`;

  const navigate = useNavigate();

  const [loadStatus, setLoadStatus] = React.useState(LoadStatus.LOADING);
  const [item, setItem] = React.useState(initialisedItem);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] =
    React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);

  const [readItem, { error }] = useLazyQuery(readItemQuery, {
    variables: { id: itemId },
    onCompleted: (data) => {
      setItem(data.readItem);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      console.error(exception);
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const [deleteItem] = useMutation(deleteItemMutation);

  const loadForm = () => {
    setLoadStatus(LoadStatus.LOADING);
    readItem();
  };

  React.useEffect(() => {
    loadForm();
  }, [itemId]);

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
      await deleteItem({
        variables: {
          id: itemId,
        },
      });
      navigate(`/`);
    } catch (exception) {
      console.error(
        `CollectionDetailView exception. Delete failed.\n${exception}`
      );
      setShowConfirmDeleteDialog(false);
      setShowMessage(true);
    }
  };

  const handleMessageClose = () => {
    setShowMessage(false);
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading...</p>;
  if (loadStatus === LoadStatus.ERROR) return <p>Error: {error?.message}</p>;

  return (
    <>
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

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={6000}
        onClose={handleMessageClose}
        open={showMessage}
      >
        <Alert
          css={classes.messageAlert}
          onClose={handleMessageClose}
          severity="error"
        >
          Unable to delete collection. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};

export { CollectionDetailView };

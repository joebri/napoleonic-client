/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';

import { classes } from './ItemDetail.style';
import { AppContext } from '../../pages/appContext';
import readItemQuery from './queries/readItemQuery';
import deleteItemMutation from './queries/deleteItemMutation';
import { View } from './View';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { LoadStatus } from '../../enums/loadStatus.enum';
import { initialisedItem } from '../../helper';

const ItemDetailView = () => {
  let { itemId } = useParams();
  const navigate = useNavigate();

  const { sortField, tags } = useContext(AppContext);
  console.log('ItemDetailView tags', tags);

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [item, setItem] = useState(initialisedItem);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

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

  useEffect(() => {
    loadForm();
  }, [itemId]);

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
      console.error(`ItemDetailView exception. Delete failed.\n${exception}`);
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
      <View item={item} onDelete={handleDeleteClick} onEdit={handleEditClick} />

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
          Unable to delete item. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};

export { ItemDetailView };

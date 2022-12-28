/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { classes } from './ItemDetail.style';
import readItemQuery from './queries/readItemQuery';
import deleteItemMutation from './queries/deleteItemMutation';
import { View } from './View';
import { AppSnackBar } from '../../components/AppSnackBar/AppSnackBar';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { LoadStatus } from '../../enums/loadStatus.enum';
import { initialisedItem } from '../../helper';

const ItemDetailView = () => {
  let { itemId } = useParams();
  const navigate = useNavigate();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [item, setItem] = useState(initialisedItem);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const errorRef: any = useRef();

  const [deleteItem] = useMutation(deleteItemMutation);

  const [readItem] = useLazyQuery(readItemQuery, {
    variables: { id: itemId },
    onCompleted: (data) => {
      setItem(data.readItem);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      console.error(exception);
      errorRef.current = exception;
      setLoadStatus(LoadStatus.ERROR);
    },
  });

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
      console.error(`ItemDetailView exception. Delete failed.\n${exception}`);
      setShowConfirmDeleteDialog(false);
      setShowMessage(true);
    }
  };

  const handleMessageClose = () => {
    setShowMessage(false);
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading...</p>;
  if (loadStatus === LoadStatus.ERROR) return <p>Error: {errorRef?.message}</p>;

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

/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';

import { classes } from './ItemDetail.style';
import readItemQuery from './queries/readItemQuery';
import updateItemMutation from './queries/updateItemMutation';
import { Edit } from './Edit';
import { LoadStatus } from '../../enums/loadStatus.enum';
import { initialisedItem } from '../../helper';

const ItemDetailEdit = () => {
  let { itemId } = useParams();
  const navigate = useNavigate();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [item, setItem] = useState(initialisedItem);
  const [showMessage, setShowMessage] = useState(false);

  const [readItem, { error }] = useLazyQuery(readItemQuery, {
    variables: { id: itemId },
    onCompleted: (data) => {
      setItem(data.readItem);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      console.error('error', itemId);
      console.error(exception);
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const [updateItem] = useMutation(updateItemMutation);

  const loadForm = () => {
    setLoadStatus(LoadStatus.LOADING);
    readItem();
  };

  useEffect(() => {
    loadForm();
  }, [itemId]);

  const handleEditChange = (field: string, value: any) => {
    //TODO need a better approach
    if (field === 'artist-name') {
      setItem((priorItem: any) => ({
        ...priorItem,
        artist: { name: value },
      }));
      return;
    }

    setItem((priorItem: any) => ({
      ...priorItem,
      [field]: value,
    }));
  };

  const handleEditCancelClick = () => {
    loadForm();
    navigate(`/itemDetailView/${itemId}`);
  };

  const handleEditSaveClick = async () => {
    try {
      const result = await updateItem({
        variables: {
          artist: item.artist.name,
          descriptionLong: item.descriptionLong,
          descriptionShort: item.descriptionShort,
          id: item.id,
          publicId: item.publicId,
          regiments: item.regiments,
          tags: item.tags,
          title: item.title,
          yearFrom: item.yearFrom,
          yearTo: item.yearTo,
        },
      });
      navigate(`/itemDetailView/${item.id}`);
    } catch (exception: any) {
      console.error(`ItemDetailEdit exception. Update failed.\n${exception}`);
      setShowMessage(true);
    }
  };

  const handleMessageClose = () => {
    setShowMessage(false);
  };

  //TODO JSB rework this
  if (loadStatus === LoadStatus.LOADING) return <p>Loading...</p>;
  if (loadStatus === LoadStatus.ERROR) return <p>Error: {error?.message}</p>;

  return (
    <>
      <Edit
        item={item}
        onCancel={handleEditCancelClick}
        onChange={handleEditChange}
        onSave={handleEditSaveClick}
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
          Unable to update item. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};

export { ItemDetailEdit };

/** @jsxImportSource @emotion/react */

import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { classes } from './ItemDetail.style';
import { Edit } from './Edit';

import { initialisedItem } from 'helper';
import { LoadStatus } from 'enums/loadStatus.enum';
import { Rating } from 'enums/rating.enum';
import { useConfirmExit } from 'hooks/useConfirmExit';
import { useLogError } from 'hooks/useLogError';
import readItemQuery from './queries/readItemQuery';
import updateItemMutation from './queries/updateItemMutation';

const ItemDetailEdit = () => {
  let { itemId } = useParams();
  const navigate = useNavigate();
  const { logError } = useLogError(ItemDetailEdit.name);

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [item, setItem] = useState(initialisedItem);
  const [showMessage, setShowMessage] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useConfirmExit(isDirty);

  const [readItem, { error }] = useLazyQuery(readItemQuery, {
    variables: { id: itemId },
    onCompleted: (data) => {
      setItem({
        ...data.readItem,
        rating: data.readItem.rating || Rating.MEDIUM,
      });
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({ name: 'readItem', exception, itemId });
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const [updateItem] = useMutation(updateItemMutation);

  const loadForm = useCallback(() => {
    setLoadStatus(LoadStatus.LOADING);
    readItem();
  }, [readItem]);

  useEffect(() => {
    loadForm();
  }, [itemId, loadForm]);

  const handleEditChange = (field: string, value: any) => {
    setItem((priorItem: any) => ({
      ...priorItem,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleEditCancelClick = () => {
    loadForm();
    navigate(`/itemDetailView/${itemId}`);
  };

  const handleEditSaveClick = async () => {
    try {
      await updateItem({
        variables: {
          artist: item.artist?.trim(),
          descriptionLong: item.descriptionLong?.trim(),
          descriptionShort: item.descriptionShort?.trim(),
          id: item.id,
          publicId: item.publicId?.trim(),
          rating: parseInt(item.rating.toString()),
          regiments: item.regiments?.trim(),
          tags: item.tags,
          title: item.title?.trim(),
          yearFrom: item.yearFrom?.trim(),
          yearTo: item.yearTo?.trim(),
        },
      });
      navigate(`/itemDetailView/${item.id}`);
    } catch (exception: any) {
      logError({
        name: 'handleEditSaveClick',
        exception,
        message: 'Update failed.',
        itemId: item.id,
      });
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
      <Helmet>
        <title>Uniformology: Edit Item</title>
      </Helmet>
      <div css={classes.container}>
        <Typography variant="h5">Edit Item</Typography>
        <Edit
          item={item}
          onCancel={handleEditCancelClick}
          onChange={handleEditChange}
          onSave={handleEditSaveClick}
        />
      </div>

      <AppSnackBar
        message="Unable to update item. Please try again."
        onClose={handleMessageClose}
        open={showMessage}
      ></AppSnackBar>

      {/* <Alert when={isDirty} message={() => 'Do you really want to leave?'} /> */}
    </>
  );
};

export { ItemDetailEdit };
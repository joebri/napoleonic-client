/** @jsxImportSource @emotion/react */

import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { classes } from './ItemDetail.style';
import { Edit } from './Edit';
import { Error } from 'components/Error/Error';
import { Loading } from 'components/Loading/Loading';

import { initialisedItem } from 'utilities/helper';
import { Item } from 'types';
import { LoadStatus } from 'enums/loadStatus.enum';
import { Rating } from 'enums/rating.enum';
import { useAppContext } from 'AppContext';
import { useConfirmExit } from 'hooks/useConfirmExit';
import { useLogError } from 'hooks/useLogError';
import readItemQuery from './queries/readItemQuery';
import updateItemMutation from './queries/updateItemMutation';
import { useNavigationTags } from 'hooks/useNavigationTags';

const ItemDetailEdit = () => {
  let { itemId } = useParams();
  const navigate = useNavigate();
  const { logError } = useLogError(ItemDetailEdit.name);

  const { navigationTags } = useAppContext();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [item, setItem] = useState(initialisedItem);
  const [showMessage, setShowMessage] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { enableLastNavigationTag } = useNavigationTags();

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

  useEffect(() => {
    enableLastNavigationTag();
  }, [enableLastNavigationTag, navigationTags]);

  const [updateItem] = useMutation(updateItemMutation);

  const loadForm = useCallback(() => {
    setLoadStatus(LoadStatus.LOADING);
    readItem();
  }, [readItem]);

  useEffect(() => {
    loadForm();
  }, [itemId, loadForm]);

  const handleEditChange = (field: string, value: string | number) => {
    setItem((priorItem: Item) => ({
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
    } catch (exception) {
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

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <Error error={error} />;
  }

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

/** @jsxImportSource @emotion/react */

import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { classes } from './CollectionDetail.style';

import { Edit } from './Edit';
import { initialisedItem } from 'helper';
import { LoadStatus } from 'enums/loadStatus.enum';
import { useLogError } from 'hooks/useLogError';
import readItemQuery from './queries/readItemQuery';
import updateItemMutation from './queries/updateItemMutation';

const CollectionDetailEdit = () => {
  let { itemId } = useParams();
  const navigate = useNavigate();
  const { logError } = useLogError(CollectionDetailEdit.name);

  const viewPageURI = `/collectionDetailView/${itemId}`;

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [item, setItem] = useState(initialisedItem);
  const [showMessage, setShowMessage] = useState(false);

  const [readItem, { error }] = useLazyQuery(readItemQuery, {
    variables: { id: itemId },
    onCompleted: (data) => {
      setItem({ ...data.readItem, rating: data.readItem.rating || 3 });
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
  };

  const handleEditCancelClick = () => {
    loadForm();
    navigate(viewPageURI);
  };

  const handleEditSaveClick = async () => {
    try {
      await updateItem({
        variables: {
          descriptionLong: item.descriptionLong.trim(),
          descriptionShort: item.descriptionShort.trim(),
          id: item.id,
          tags: item.tags,
          title: item.title.trim(),
        },
      });
      navigate(viewPageURI);
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

  if (loadStatus === LoadStatus.LOADING) return <p>Loading...</p>;
  if (loadStatus === LoadStatus.ERROR) return <p>Error: {error?.message}</p>;

  return (
    <>
      <Helmet>
        <title>Uniformology: Edit Collection</title>
      </Helmet>
      <div css={classes.container}>
        <Typography variant="h5">Edit Collection</Typography>
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
    </>
  );
};

export { CollectionDetailEdit };

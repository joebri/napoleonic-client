/** @jsxImportSource @emotion/react */

import { useLazyQuery, useMutation } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { Edit } from './Edit';
import { classes } from './ItemDetail.style';

import { LoadStatus } from 'enums/loadStatus.enum';
import { Rating } from 'enums/rating.enum';
import { useConfirmExit } from 'hooks/useConfirmExit';
import { logError } from 'utilities/logError';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { Item } from 'types';
import { initialisedItem } from 'utilities/helper';
import { readItemQuery } from './queries/readItemQuery';
import { updateItemMutation } from './queries/updateItemMutation';

const ItemDetailEdit = () => {
  let { itemId } = useParams();
  const navigate = useNavigate();
  const moduleName = `${ItemDetailEdit.name}.tsx`;

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
      logError({ moduleName, name: 'readItem', exception, itemId });
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const [updateItem] = useMutation(updateItemMutation, {
    onCompleted: () => {
      navigate(`/itemDetailView/${item.id}`);
    },
    onError: (exception) => {
      logError({ moduleName, name: 'updateItem', exception, itemId });
      setShowMessage(true);
    },
  });

  useEffect(() => {
    enableLastNavigationTag();
  }, [enableLastNavigationTag]);

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

  const handleEditSaveClick = () => {
    updateItem({
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
    </>
  );
};

export { ItemDetailEdit };

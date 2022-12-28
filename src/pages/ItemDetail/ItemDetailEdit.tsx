/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet';

import { classes } from './ItemDetail.style';
import readItemQuery from './queries/readItemQuery';
import updateItemMutation from './queries/updateItemMutation';
import { Edit } from './Edit';
import { AppSnackBar } from '../../components/AppSnackBar/AppSnackBar';
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
      setItem({ ...data.readItem, rating: data.readItem.rating || 3 });
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
    // if (field === 'artist-name') {
    //   setItem((priorItem: any) => ({
    //     ...priorItem,
    //     artist: { name: value },
    //   }));
    //   return;
    // }

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

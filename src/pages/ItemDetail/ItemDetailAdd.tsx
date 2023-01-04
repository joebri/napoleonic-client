/** @jsxImportSource @emotion/react */

import { Helmet } from 'react-helmet-async';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Typography from '@mui/material/Typography';

import { AppSnackBar } from '../../components/AppSnackBar/AppSnackBar';
import { classes } from './ItemDetail.style';

import { Edit } from './Edit';
import { Item } from 'types';
import { initialisedItem } from 'helper';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useLogError } from 'hooks/useLogError';
import createItemMutation from './queries/createItemMutation';

const ItemDetailAdd = () => {
  const navigate = useNavigate();
  const [template] = useLocalStorage<any>('template', {
    artist: '',
    tags: [],
    urlRoot: '',
  });
  const { logError } = useLogError(ItemDetailAdd.name);

  const [item, setItem] = useState({
    ...initialisedItem,
    artist: template.artist,
    publicId: template.urlRoot,
    tags: template.tags.split(','),
    yearFrom: template.yearFrom,
  });
  const [showMessage, setShowMessage] = useState(false);

  const [createItem] = useMutation(createItemMutation);

  const handleEditChange = (field: string, value: string | number) => {
    setItem((priorItem: Item) => ({
      ...priorItem,
      [field]: value,
    }));
  };

  const handleEditCancelClick = () => {
    navigate(`/`);
  };

  const handleEditSaveClick = async () => {
    try {
      const result = await createItem({
        variables: {
          artist: item.artist?.trim(),
          descriptionLong: item.descriptionLong?.trim(),
          descriptionShort: item.descriptionShort?.trim(),
          publicId: item.publicId?.trim(),
          rating: parseInt(item.rating.toString()),
          regiments: item.regiments?.trim(),
          tags: item.tags,
          title: item.title?.trim(),
          yearFrom: item.yearFrom?.trim(),
          yearTo: item.yearTo?.trim(),
        },
      });
      navigate(`/itemDetailView/${result.data.createItem}`);
    } catch (exception) {
      logError({
        name: 'handleEditSaveClick',
        exception,
        message: 'Create failed.',
      });
      setShowMessage(true);
    }
  };

  const handleMessageClose = () => {
    setShowMessage(false);
  };

  return (
    <>
      <Helmet>
        <title>Uniformology: Add Item</title>
      </Helmet>
      <div css={classes.container}>
        <Typography variant="h5">Add Item</Typography>
        <Edit
          item={item}
          onCancel={handleEditCancelClick}
          onChange={handleEditChange}
          onSave={handleEditSaveClick}
        />
      </div>

      <AppSnackBar
        message="Unable to create item. Please try again."
        onClose={handleMessageClose}
        open={showMessage}
      ></AppSnackBar>
    </>
  );
};

export { ItemDetailAdd };

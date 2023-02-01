/** @jsxImportSource @emotion/react */

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import { AppSnackBar } from '../../components/AppSnackBar/AppSnackBar';
import { classes } from './ItemDetail.style';
import { Edit } from './Edit';

import { createItemMutation } from './queries/createItemMutation';
import { initialisedItem } from 'utilities/helper';
import { Item } from 'types';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useLogError } from 'hooks/useLogError';
import { useNavigationTags } from 'hooks/useNavigationTags';

const ItemDetailAdd = () => {
  const navigate = useNavigate();
  const { logError } = useLogError(`${ItemDetailAdd.name}.tsx`);

  const [template] = useLocalStorage<any>('template', {
    artist: '',
    tags: '',
    urlRoot: '',
    yearFrom: '',
  });

  const [item, setItem] = useState({
    ...initialisedItem,
    artist: template.artist,
    publicId: template.urlRoot,
    tags: template.tags.split(','),
    yearFrom: template.yearFrom,
  });
  const [showMessage, setShowMessage] = useState(false);

  const { enableLastNavigationTag } = useNavigationTags();

  useEffect(() => {
    enableLastNavigationTag();
  }, [enableLastNavigationTag]);

  const [createItem] = useMutation(createItemMutation, {
    onCompleted: (data) => {
      navigate(`/itemDetailView/${data.createItem}`);
    },
    onError: (exception) => {
      logError({
        name: 'createItem',
        exception,
        message: 'Create failed.',
      });
      setShowMessage(true);
    },
  });

  const handleEditChange = (field: string, value: string | number) => {
    setItem((priorItem: Item) => ({
      ...priorItem,
      [field]: value,
    }));
  };

  const handleEditCancelClick = () => {
    navigate(`/`);
  };

  const handleEditSaveClick = () => {
    createItem({
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
      />
    </>
  );
};

export { ItemDetailAdd };

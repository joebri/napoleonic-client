/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Alert, Snackbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet';

import { classes } from './ItemDetail.style';
import createItemMutation from './queries/createItemMutation';
import { Edit } from './Edit';
import { AppSnackBar } from '../../components/AppSnackBar/AppSnackBar';
import { initialisedItem } from '../../helper';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const ItemDetailAdd = () => {
  const navigate = useNavigate();

  const [template, setTemplate] = useLocalStorage<any>('template', {
    artist: '',
    tags: [],
    urlRoot: '',
  });

  const [item, setItem] = useState({
    ...initialisedItem,
    artist: template.artist,
    publicId: template.urlRoot,
    tags: template.tags.split(','),
    yearFrom: template.yearFrom,
  });
  const [showMessage, setShowMessage] = useState(false);

  const [createItem] = useMutation(createItemMutation);

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
    } catch (exception: any) {
      console.error(`ItemDetailAdd exception. Create failed.\n${exception}`);
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

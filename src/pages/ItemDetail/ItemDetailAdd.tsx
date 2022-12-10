/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Alert, Snackbar } from '@mui/material';

import { classes } from './ItemDetail.style';
import createItemMutation from './queries/createItemMutation';
import { Edit } from './Edit';
import { initialisedItem } from '../../helper';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const template = {
  urlRoot: 'Napoleonic/France/Cavalry/',
  tags: ['France', 'Cavalry'],
};

const ItemDetailAdd = () => {
  const navigate = useNavigate();

  const [template, setTemplate] = useLocalStorage<any>('template', {
    urlRoot: '',
    tags: [],
  });

  const [item, setItem] = useState({
    ...initialisedItem,
    publicId: template.urlRoot,
    tags: template.tags.split(','),
  });
  const [showMessage, setShowMessage] = useState(false);

  const [createItem] = useMutation(createItemMutation);

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
    navigate(`/`);
  };

  const handleEditSaveClick = async () => {
    try {
      const result = await createItem({
        variables: {
          artist: item.artist.name,
          descriptionLong: item.descriptionLong,
          descriptionShort: item.descriptionShort,
          publicId: item.publicId,
          regiments: item.regiments,
          tags: item.tags,
          title: item.title,
          yearFrom: item.yearFrom,
          yearTo: item.yearTo,
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
          Unable to create item. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};

export { ItemDetailAdd };

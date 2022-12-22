/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Alert, Snackbar } from '@mui/material';
import Typography from '@mui/material/Typography';

import { classes } from './CollectionDetail.style';
import createItemMutation from './queries/createItemMutation';
import { Edit } from './Edit';
import { initialisedItem } from '../../helper';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CollectionDetailAdd = () => {
  const navigate = useNavigate();

  const [template, setTemplate] = useLocalStorage<any>('template', {
    artist: '',
    tags: [],
    urlRoot: '',
  });

  const [item, setItem] = useState({
    ...initialisedItem,
    artist: {
      name: template.artist,
    },
    publicId: '/Napoleonic/GreeceBar_wphbeq.gif',
    tags: template.tags.split(','),
  });
  const [showMessage, setShowMessage] = useState(false);

  const [createItem] = useMutation(createItemMutation);

  const handleEditChange = (field: string, value: any) => {
    setItem((priorItem: any) => ({
      ...priorItem,
      [field]: value,
    }));
  };

  const handleEditCancelClick = () => {
    navigate(`/collections`);
  };

  const handleEditSaveClick = async () => {
    try {
      const result = await createItem({
        variables: {
          descriptionLong: item.descriptionLong,
          descriptionShort: item.descriptionShort,
          tags: item.tags,
          title: item.title,
        },
      });
      console.info(
        'Manually create collection record for:',
        result.data.createItem
      );
      navigate(`/collectionDetailView/${result.data.createItem}`);
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
      <div css={classes.container}>
        <Typography variant="h4">Add Collection</Typography>
        <Edit
          item={item}
          onCancel={handleEditCancelClick}
          onChange={handleEditChange}
          onSave={handleEditSaveClick}
        />
      </div>

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

export { CollectionDetailAdd };

/** @jsxImportSource @emotion/react */

import { Helmet } from 'react-helmet';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Typography from '@mui/material/Typography';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { classes } from './CollectionDetail.style';

import { Edit } from './Edit';
import { initialisedItem } from 'helper';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useLogError } from 'hooks/useLogError';
import createItemMutation from './queries/createItemMutation';

const CollectionDetailAdd = () => {
  const navigate = useNavigate();
  const { logError } = useLogError(CollectionDetailAdd.name);

  const [template] = useLocalStorage<any>('template', {
    artist: '',
    tags: [],
    urlRoot: '',
  });

  const [item, setItem] = useState({
    ...initialisedItem,
    artist: template.artist,
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
          descriptionLong: item.descriptionLong.trim(),
          descriptionShort: item.descriptionShort.trim(),
          tags: item.tags,
          title: item.title.trim(),
        },
      });
      console.info(
        'Now manually create collection record for:',
        result.data.createItem
      );
      navigate(`/collectionDetailView/${result.data.createItem}`);
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
        <title>Uniformology: Add Collection</title>
      </Helmet>
      <div css={classes.container}>
        <Typography variant="h5">Add Collection</Typography>
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

export { CollectionDetailAdd };

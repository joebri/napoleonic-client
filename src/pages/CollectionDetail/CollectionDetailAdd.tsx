/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet';

import { classes } from './CollectionDetail.style';
import createItemMutation from './queries/createItemMutation';
import { Edit } from './Edit';
import { AppSnackBar } from '../../components/AppSnackBar/AppSnackBar';
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

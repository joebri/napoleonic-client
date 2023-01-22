/** @jsxImportSource @emotion/react */

import { Helmet } from 'react-helmet-async';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Typography from '@mui/material/Typography';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { classes } from './CollectionDetail.style';

import { Collection } from 'types';
import { Edit } from './Edit';
import { initialisedCollection } from 'helper';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useLogError } from 'hooks/useLogError';
import createCollectionMutation from './queries/createCollectionMutation';

const CollectionDetailAdd = () => {
  const navigate = useNavigate();
  const { logError } = useLogError(CollectionDetailAdd.name);

  const [template] = useLocalStorage<any>('template', {
    artist: '',
    tags: '',
    urlRoot: '',
    yearFrom: '',
  });

  const [collection, setCollection] = useState({
    ...initialisedCollection,
    tags: template.tags.split(','),
  });
  const [showMessage, setShowMessage] = useState(false);

  const [createCollection] = useMutation(createCollectionMutation);

  const handleEditChange = (field: string, value: string | number) => {
    setCollection((priorCollection: Collection) => ({
      ...priorCollection,
      [field]: value,
    }));
  };

  const handleEditCancelClick = () => {
    navigate(`/collections`);
  };

  const handleEditSaveClick = async () => {
    try {
      const result = await createCollection({
        variables: {
          descriptionLong: collection.descriptionLong.trim(),
          descriptionShort: collection.descriptionShort.trim(),
          tagName: collection.tagName.trim(),
          tags: collection.tags,
          title: collection.title.trim(),
        },
      });
      navigate(`/collectionDetailView/${result.data.createCollection}`);
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
          collection={collection}
          onCancel={handleEditCancelClick}
          onChange={handleEditChange}
          onSave={handleEditSaveClick}
        />
      </div>

      <AppSnackBar
        message="Unable to create Collection. Please try again."
        onClose={handleMessageClose}
        open={showMessage}
      ></AppSnackBar>
    </>
  );
};

export { CollectionDetailAdd };

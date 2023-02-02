/** @jsxImportSource @emotion/react */

import { useLazyQuery, useMutation } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { classes } from './CollectionDetail.style';
import { Edit } from './Edit';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useLogError } from 'hooks/useLogError';
import { Collection } from 'types';
import { initialisedCollection } from 'utilities/helper';
import { readCollectionQuery } from './queries/readCollectionQuery';
import { updateCollectionMutation } from './queries/updateCollectionMutation';

const CollectionDetailEdit = () => {
  let { collectionId } = useParams();
  const navigate = useNavigate();
  const { logError } = useLogError(`${CollectionDetailEdit.name}.tsx`);

  const viewPageURI = `/collectionDetailView/${collectionId}`;

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [collection, setCollection] = useState(initialisedCollection);
  const [showMessage, setShowMessage] = useState(false);

  const [readCollection, { error }] = useLazyQuery(readCollectionQuery, {
    variables: { id: collectionId },
    onCompleted: (data) => {
      setCollection({
        ...data.readCollection,
      });
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({ name: 'readCollection', exception, collectionId });
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const [updateCollection] = useMutation(updateCollectionMutation);

  const loadForm = useCallback(() => {
    setLoadStatus(LoadStatus.LOADING);
    readCollection();
  }, [readCollection]);

  useEffect(() => {
    loadForm();
  }, [collectionId, loadForm]);

  const handleEditChange = (field: string, value: string | number) => {
    setCollection((priorCollection: Collection) => ({
      ...priorCollection,
      [field]: value,
    }));
  };

  const handleEditCancelClick = () => {
    loadForm();
    navigate(viewPageURI);
  };

  const handleEditSaveClick = async () => {
    try {
      await updateCollection({
        variables: {
          descriptionLong: collection.descriptionLong.trim(),
          descriptionShort: collection.descriptionShort.trim(),
          id: collection.id,
          tagName: collection.tagName.trim(),
          tags: collection.tags,
          title: collection.title.trim(),
        },
      });
      navigate(viewPageURI);
    } catch (exception) {
      logError({
        name: 'handleEditSaveClick',
        exception,
        message: 'Update failed.',
        collectionId: collection.id,
      });
      setShowMessage(true);
    }
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
        <title>Uniformology: Edit Collection</title>
      </Helmet>
      <div css={classes.container}>
        <Typography variant="h5">Edit Collection</Typography>
        <Edit
          collection={collection}
          onCancel={handleEditCancelClick}
          onChange={handleEditChange}
          onSave={handleEditSaveClick}
        />
      </div>

      <AppSnackBar
        message="Unable to update Collection. Please try again."
        onClose={handleMessageClose}
        open={showMessage}
      ></AppSnackBar>
    </>
  );
};

export { CollectionDetailEdit };

/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import Typography from '@mui/material/Typography';

import { classes } from './CollectionDetail.style';
import readItemQuery from './queries/readItemQuery';
import updateItemMutation from './queries/updateItemMutation';
import { Edit } from './Edit';
import { LoadStatus } from '../../enums/loadStatus.enum';
import { initialisedItem } from '../../helper';

const CollectionDetailEdit = () => {
  // const [searchParams] = useSearchParams();
  // const itemId = searchParams.get('id');
  let { itemId } = useParams();

  const viewPageURI = `/collectionDetailView/${itemId}`;

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
    setItem((priorItem: any) => ({
      ...priorItem,
      [field]: value,
    }));
  };

  const handleEditCancelClick = () => {
    loadForm();
    navigate(viewPageURI);
  };

  const handleEditSaveClick = async () => {
    try {
      await updateItem({
        variables: {
          descriptionLong: item.descriptionLong,
          descriptionShort: item.descriptionShort,
          id: item.id,
          tags: item.tags,
          title: item.title,
        },
      });
      navigate(viewPageURI);
    } catch (exception: any) {
      console.error(
        `CollectionDetailEdit exception. Update failed.\n${exception}`
      );
      setShowMessage(true);
    }
  };

  const handleMessageClose = () => {
    setShowMessage(false);
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading...</p>;
  if (loadStatus === LoadStatus.ERROR) return <p>Error: {error?.message}</p>;

  return (
    <>
      <div css={classes.container}>
        <Typography variant="h4">Edit Collection</Typography>
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
          Unable to update item. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};

export { CollectionDetailEdit };

/** @jsxImportSource @emotion/react */

import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { classes } from './CollectionDetail.style';
import { Edit } from './Edit';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useCollectionDetailEdit } from './useCollectionDetailEdit';

const CollectionDetailEdit = () => {
  const moduleName = `${CollectionDetailEdit.name}.tsx`;

  const {
    collection,
    error,
    handleEditCancelClick,
    handleEditChange,
    handleEditSaveClick,
    handleMessageClose,
    loadStatus,
    showMessage,
  } = useCollectionDetailEdit(moduleName);

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

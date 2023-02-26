/** @jsxImportSource @emotion/react */

import { Helmet } from 'react-helmet-async';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ConfirmDeleteDialog } from 'components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { classes } from './ItemDetail.style';
import { View } from './View';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useItemDetailView } from './useItemDetailView';

const ItemDetailView = () => {
  const moduleName = `${ItemDetailView.name}.tsx`;

  const {
    error,
    handleDeleteCancelled,
    handleDeleteClick,
    handleDeleteConfirmed,
    handleEditClick,
    handleMessageClose,
    item,
    loadStatus,
    showConfirmDeleteDialog,
    showMessage,
  } = useItemDetailView(moduleName);

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <ErrorHandler error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Uniformology: Item</title>
      </Helmet>
      <div css={classes.container}>
        <View
          item={item}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
        />
      </div>

      <ConfirmDeleteDialog
        isOpen={showConfirmDeleteDialog}
        onClose={handleDeleteCancelled}
        onDeleteConfirmed={handleDeleteConfirmed}
      />

      <AppSnackBar
        message="Unable to delete item. Please try again."
        onClose={handleMessageClose}
        open={showMessage}
      ></AppSnackBar>
    </>
  );
};

export { ItemDetailView };

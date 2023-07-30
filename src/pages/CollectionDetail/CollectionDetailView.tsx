import { Helmet } from 'react-helmet-async';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ConfirmDeleteDialog } from 'components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';

import styles from './CollectionDetail.module.scss';
import { View } from './View';
import { useCollectionDetailView } from './useCollectionDetailView';

const CollectionDetailView = () => {
  const moduleName = `${CollectionDetailView.name}.tsx`;

  const {
    collection,
    error,
    handleDeleteCancelled,
    handleDeleteClick,
    handleDeleteConfirmed,
    handleEditClick,
    handleMessageClose,
    loadStatus,
    showConfirmDeleteDialog,
    showMessage,
  } = useCollectionDetailView(moduleName);

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <ErrorHandler error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Uniformology: Collection</title>
      </Helmet>
      <div className={styles.container}>
        <View
          collection={collection}
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
        message="Unable to delete collection. Please try again."
        onClose={handleMessageClose}
        open={showMessage}
      ></AppSnackBar>
    </>
  );
};

export { CollectionDetailView };

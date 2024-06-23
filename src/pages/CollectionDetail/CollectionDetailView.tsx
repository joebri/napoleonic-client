import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const {
        collection,
        collectionId,
        error,
        isConfirmDeleteDialogVisible,
        isMessageVisible,
        loadStatus,
        setIsConfirmDeleteDialogVisible,
        setIsMessageVisible,
        tryDelete,
    } = useCollectionDetailView(moduleName);

    const EDIT_PAGE_URI = `/collectionDetailEdit/${collectionId}`;

    const handleEditClick = () => {
        navigate(EDIT_PAGE_URI);
    };

    const handleDeleteClick = () => {
        setIsConfirmDeleteDialogVisible(true);
    };

    const handleDeleteCancelled = () => {
        setIsConfirmDeleteDialogVisible(false);
    };

    const handleDeleteConfirmed = async () => {
        await tryDelete();
        navigate(`/gallery`);
    };

    const handleMessageClose = () => {
        setIsMessageVisible(false);
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }

    return (
        <>
            {/* <Helmet>
                <title>Uniformology: Collection</title>
            </Helmet> */}
            <div className={styles.container}>
                <View
                    collection={collection}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                />
            </div>

            <ConfirmDeleteDialog
                isOpen={isConfirmDeleteDialogVisible}
                onClose={handleDeleteCancelled}
                onDeleteConfirmed={handleDeleteConfirmed}
            />

            <AppSnackBar
                message="Unable to delete collection. Please try again."
                onClose={handleMessageClose}
                open={isMessageVisible}
            ></AppSnackBar>
        </>
    );
};

export { CollectionDetailView };

import { AppSnackBar } from '@components/AppSnackBar/AppSnackBar';
import { ConfirmDeleteDialog } from '@components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import { Loading } from '@components/Loading/Loading';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useNavigate } from 'react-router-dom';

import styles from './ItemDetail.module.scss';
import { View } from './View';
import {
    type ItemDetailDeleteProps,
    useItemDetailView,
} from './useItemDetailView';

const ItemDetailView = () => {
    const moduleName = `${ItemDetailView.name}.tsx`;
    const navigate = useNavigate();

    const onCompletedDelete = () => {
        navigate(`/gallery`);
    };

    const {
        error,
        isMessageVisible,
        item,
        loadStatus,
        setIsMessageVisible,
        setIsConfirmDeleteDialogVisible,
        isConfirmDeleteDialogVisible,
        tryDelete,
    } = useItemDetailView({
        moduleName,
        onCompletedDelete,
    } as ItemDetailDeleteProps);

    const handleEditClick = () => {
        navigate(`/itemDetailEdit/${item.id}`);
    };

    const handleDeleteClick = () => {
        setIsConfirmDeleteDialogVisible(true);
    };

    const handleDeleteCancelled = () => {
        setIsConfirmDeleteDialogVisible(false);
    };

    const handleMessageClose = () => {
        setIsMessageVisible(false);
    };

    const handleDeleteConfirmed = async () => {
        tryDelete();
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }

    return (
        <>
            <div className={styles.container}>
                <View
                    item={item}
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
                message="Unable to delete item. Please try again."
                onClose={handleMessageClose}
                open={isMessageVisible}
            ></AppSnackBar>
        </>
    );
};

export { ItemDetailView };

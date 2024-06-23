import { Typography } from '@mui/material';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';

import { Edit } from './Edit';
import styles from './ItemDetail.module.scss';
import { useItemDetailEdit } from './useItemDetailEdit';

const ItemDetailEdit = () => {
    const moduleName = `${ItemDetailEdit.name}.tsx`;

    const {
        error,
        handleEditCancelClick,
        handleEditChange,
        handleEditSaveClick,
        handleMessageClose,
        item,
        loadStatus,
        showMessage,
    } = useItemDetailEdit(moduleName);

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }

    return (
        <>
            <div className={styles.container}>
                <Typography variant="h5">Edit Item</Typography>
                <Edit
                    item={item}
                    onCancel={handleEditCancelClick}
                    onChange={handleEditChange}
                    onSave={handleEditSaveClick}
                />
            </div>

            <AppSnackBar
                message="Unable to update item. Please try again."
                onClose={handleMessageClose}
                open={showMessage}
            ></AppSnackBar>
        </>
    );
};

export { ItemDetailEdit };

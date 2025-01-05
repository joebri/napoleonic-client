import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';

import { Edit } from './Edit';
import styles from './ItemDetail.module.scss';
import {
    type ItemDetailEditProps,
    useItemDetailEdit,
} from './useItemDetailEdit';

const ItemDetailEdit = () => {
    const moduleName = `${ItemDetailEdit.name}.tsx`;
    const navigate = useNavigate();

    const onCompletedEdit = (itemId: string) => {
        navigate(`/itemDetailView/${itemId}`);
    };

    const {
        error,
        isMessageVisible,
        item,
        itemId,
        loadForm,
        loadStatus,
        setIsMessageVisible,
        tryUpdate,
        updateFieldValue,
    } = useItemDetailEdit({
        moduleName,
        onCompletedEdit,
    } as ItemDetailEditProps);

    const handleEditChange = (field: string, value: string | number) => {
        updateFieldValue(field, value);
    };

    const handleEditCancelClick = () => {
        loadForm();
        navigate(`/itemDetailView/${itemId}`);
    };

    const handleEditSaveClick = () => {
        tryUpdate();
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
                open={isMessageVisible}
            ></AppSnackBar>
        </>
    );
};

export { ItemDetailEdit };

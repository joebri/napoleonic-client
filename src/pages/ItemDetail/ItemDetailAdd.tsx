import { AppSnackBar } from '@components/AppSnackBar/AppSnackBar';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Edit } from './Edit';
import styles from './ItemDetail.module.scss';
import { type ItemDetailAddProps, useItemDetailAdd } from './useItemDetailAdd';

const ItemDetailAdd = () => {
    const moduleName = `${ItemDetailAdd.name}.tsx`;
    const navigate = useNavigate();

    const onCompletedAdd = (itemId: string) => {
        navigate(`/itemDetailView/${itemId}`);
    };

    const {
        isMessageVisible,
        item,
        setIsMessageVisible,
        tryCreateItem,
        updateFieldValue,
    } = useItemDetailAdd({ moduleName, onCompletedAdd } as ItemDetailAddProps);

    const handleEditChange = (field: string, value: string | number) => {
        updateFieldValue(field, value);
    };

    const handleEditCancelClick = () => {
        navigate(`/gallery`);
    };

    const handleEditSaveClick = () => {
        tryCreateItem();
    };

    const handleMessageClose = () => {
        setIsMessageVisible(false);
    };

    return (
        <>
            <div className={styles.container}>
                <Typography variant="h5">Add Item</Typography>
                <Edit
                    item={item}
                    onCancel={handleEditCancelClick}
                    onChange={handleEditChange}
                    onSave={handleEditSaveClick}
                />
            </div>

            <AppSnackBar
                message="Unable to create item. Please try again."
                onClose={handleMessageClose}
                open={isMessageVisible}
            />
        </>
    );
};

export { ItemDetailAdd };

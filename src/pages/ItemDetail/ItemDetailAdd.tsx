import { AppSnackBar } from '@components/AppSnackBar/AppSnackBar';
import { Item } from '@models/Item.model';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Edit } from './Edit';
import styles from './ItemDetail.module.scss';
import { type ItemDetailAddProps, useItemDetailAdd } from './useItemDetailAdd';

export const ItemDetailAdd = () => {
    const moduleName = `${ItemDetailAdd.name}.tsx`;
    const navigate = useNavigate();

    const onCompletedAdd = (itemId: string) => {
        navigate(`/itemDetailView/${itemId}`);
    };

    const { isMessageVisible, item, setIsMessageVisible, tryCreateItem } =
        useItemDetailAdd({ moduleName, onCompletedAdd } as ItemDetailAddProps);

    const handleEditCancelClick = () => {
        navigate(`/gallery`);
    };

    const handleEditSaveClick = (item: Item) => {
        tryCreateItem(item);
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

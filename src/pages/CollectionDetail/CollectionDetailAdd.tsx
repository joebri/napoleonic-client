import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';

import styles from './CollectionDetail.module.scss';
import { Edit } from './Edit';
import { useCollectionDetailAdd } from './useCollectionDetailAdd';

const CollectionDetailAdd = () => {
    const moduleName = `${CollectionDetailAdd.name}.tsx`;
    const navigate = useNavigate();

    const {
        collection,
        isMessageVisible,
        setIsMessageVisible,
        tryCreate,
        updateFieldValue,
    } = useCollectionDetailAdd(moduleName);

    const handleEditCancelClick = () => {
        navigate(`/collections`);
    };

    const handleEditChange = (field: string, value: string | number) => {
        updateFieldValue(field, value);
    };

    const handleEditSaveClick = async () => {
        const name = await tryCreate();
        navigate(`/collectionDetailView/${name}`);
    };

    const handleMessageClose = () => {
        setIsMessageVisible(false);
    };

    return (
        <>
            <div className={styles.container}>
                <Typography variant="h5">Add Collection</Typography>
                <Edit
                    collection={collection}
                    onCancel={handleEditCancelClick}
                    onChange={handleEditChange}
                    onSave={handleEditSaveClick}
                />
            </div>

            <AppSnackBar
                message="Unable to create Collection. Please try again."
                onClose={handleMessageClose}
                open={isMessageVisible}
            ></AppSnackBar>
        </>
    );
};

export { CollectionDetailAdd };

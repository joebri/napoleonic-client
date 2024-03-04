import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';

import styles from './CollectionDetail.module.scss';
import { Edit } from './Edit';
import { useCollectionDetailAdd } from './useCollectionDetailAdd';

const CollectionDetailAdd = () => {
    const moduleName = `${CollectionDetailAdd.name}.tsx`;

    const {
        collection,
        handleEditCancelClick,
        handleEditChange,
        handleEditSaveClick,
        handleMessageClose,
        showMessage,
    } = useCollectionDetailAdd(moduleName);

    return (
        <>
            <Helmet>
                <title>Uniformology: Add Collection</title>
            </Helmet>
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
                open={showMessage}
            ></AppSnackBar>
        </>
    );
};

export { CollectionDetailAdd };

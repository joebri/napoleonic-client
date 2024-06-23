import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';

import styles from './CollectionDetail.module.scss';
import { Edit } from './Edit';
import { useCollectionDetailEdit } from './useCollectionDetailEdit';

const CollectionDetailEdit = () => {
    const moduleName = `${CollectionDetailEdit.name}.tsx`;
    const navigate = useNavigate();

    const {
        collection,
        collectionId,
        error,
        isMessageVisible,
        loadForm,
        loadStatus,
        setIsMessageVisible,
        tryUpdate,
        updateFieldValue,
    } = useCollectionDetailEdit(moduleName);

    const VIEW_PAGE_URI = `/collectionDetailView/${collectionId}`;

    const handleEditChange = (field: string, value: string | number) => {
        updateFieldValue(field, value);
    };

    const handleEditCancelClick = () => {
        loadForm();
        navigate(VIEW_PAGE_URI);
    };

    const handleEditSaveClick = async () => {
        await tryUpdate();
        navigate(VIEW_PAGE_URI);
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
                <Typography variant="h5">Edit Collection</Typography>
                <Edit
                    collection={collection}
                    onCancel={handleEditCancelClick}
                    onChange={handleEditChange}
                    onSave={handleEditSaveClick}
                />
            </div>

            <AppSnackBar
                message="Unable to update Collection. Please try again."
                onClose={handleMessageClose}
                open={isMessageVisible}
            ></AppSnackBar>
        </>
    );
};

export { CollectionDetailEdit };

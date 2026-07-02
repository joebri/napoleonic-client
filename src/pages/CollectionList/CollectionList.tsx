import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import { Loading } from '@components/Loading/Loading';
import { LoadStatus } from '@enums/loadStatus.enum';
import { Collection } from '@models/Collection.model';
import { Autocomplete, Button, TextField } from '@mui/material';
import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './CollectionList.module.scss';
import { useCollectionList } from './useCollectionList';

export const CollectionList = () => {
    const moduleName = `${CollectionList.name}.tsx`;
    const navigate = useNavigate();

    const { collections, error, loadStatus } = useCollectionList({
        moduleName,
    });

    const handleSearchClick = (collection: Collection) => {
        navigate(`/collectionDetailView/${collection.id}`);
    };

    const handleSelectionChange = (
        _: SyntheticEvent,
        collection: Collection | null
    ) => {
        if (collection) {
            navigate(`/collectionDetailView/${collection.id}`);
        }
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }

    return (
        <div className={styles.container}>
            <Autocomplete
                className={styles.filter}
                getOptionLabel={(collection) => collection.title || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleSelectionChange}
                options={collections}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search or select a collection"
                    />
                )}
                value={null}
            />

            {collections.map((collection: Collection) => (
                <Button
                    key={collection.id}
                    onClick={() => {
                        handleSearchClick(collection);
                    }}
                    title={collection.tagName}
                    variant="contained"
                >
                    {collection.title}
                </Button>
            ))}
        </div>
    );
};

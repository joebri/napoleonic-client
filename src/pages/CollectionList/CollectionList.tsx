import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';
import { Collection } from 'types';

import styles from './CollectionList.module.scss';
import { useCollectionList } from './useCollectionList';

const CollectionList = () => {
    const moduleName = `${CollectionList.name}.tsx`;
    const navigate = useNavigate();

    const { collections, error, loadStatus } = useCollectionList(moduleName);

    const handleSearchClick = (collection: Collection) => {
        navigate(`/collectionDetailView/${collection.id}`);
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
                {collections.map((collection: Collection, index: number) => (
                    <Button
                        key={index}
                        onClick={() => {
                            handleSearchClick(collection);
                        }}
                        title={collection.title}
                        variant="contained"
                    >
                        {`${collection.tagName}`}
                    </Button>
                ))}
            </div>
        </>
    );
};

export { CollectionList };

import { Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';
import { Collection } from 'types';

import styles from './CollectionList.module.scss';
import { useCollectionList } from './useCollectionList';

const CollectionList = () => {
    const moduleName = `${CollectionList.name}.tsx`;

    const { collections, error, handleSearchClick, loadStatus } =
        useCollectionList(moduleName);

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }

    return (
        <>
            <Helmet>
                <title>Uniformology: Collections</title>
            </Helmet>
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

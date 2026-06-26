import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import { ItemCardList } from '@components/ItemCardList/ItemCardList';
import { Loading } from '@components/Loading/Loading';
import { LoadStatus } from '@enums/loadStatus.enum';
import { Pagination, Stack, TextField } from '@mui/material';
import { ChangeEvent, KeyboardEvent } from 'react';

import styles from './Gallery.module.scss';
import { useGallery } from './useGallery';

export const Gallery = () => {
    const moduleName = `${Gallery.name}.tsx`;

    const {
        changePageNumber,
        error,
        itemsRef,
        loadStatus,
        pageCount,
        pageNumber,
        requestedPageNumber,
        setPageNumber,
        setRequestedPageNumber,
        wrapperRef,
    } = useGallery(moduleName);

    const handlePageNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRequestedPageNumber(event.target.value);
    };

    const handlePageNumberKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        changePageNumber(event.code);
    };

    const handlePaginationChange = (
        _: ChangeEvent<unknown>,
        newPageNumber: number
    ) => {
        setPageNumber(newPageNumber);
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }

    return (
        <>
            <div className={styles.wrapper} ref={wrapperRef} tabIndex={0}>
                <div id="scrollableView" className={styles.listwrapper}>
                    <ItemCardList items={itemsRef.current}></ItemCardList>
                </div>
                {pageCount > 0 && (
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 4,
                            justifyContent: 'center', //TODO JSB fix this
                        }}
                    >
                        <Pagination
                            className={styles.pager}
                            count={pageCount}
                            onChange={handlePaginationChange}
                            page={pageNumber}
                            shape="rounded"
                            variant="outlined"
                        />
                        <TextField
                            className={styles.pageNumber}
                            onChange={handlePageNumberChange}
                            onKeyDown={handlePageNumberKeyDown}
                            size="small"
                            type="number"
                            value={requestedPageNumber}
                            variant="outlined"
                        />
                    </Stack>
                )}
            </div>
        </>
    );
};

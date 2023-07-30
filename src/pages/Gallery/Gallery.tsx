import { Pagination, Stack, TextField } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { ItemCardList } from 'components/ItemCardList/ItemCardList';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';

import styles from './Gallery.module.scss';
import { useGallery } from './useGallery';

const Gallery = () => {
  const moduleName = `${Gallery.name}.tsx`;

  const {
    error,
    handlePageNumberChange,
    handlePageNumberKeyDown,
    handlePaginationChange,
    itemsRef,
    loadStatus,
    pageCount,
    pageNumber,
    requestedPageNumber,
    wrapperRef,
  } = useGallery(moduleName);

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <ErrorHandler error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Uniformology: Gallery</title>
      </Helmet>
      <div className={styles.wrapper} ref={wrapperRef} tabIndex={0}>
        <div id="scrollableView" className={styles.listwrapper}>
          <ItemCardList items={itemsRef.current}></ItemCardList>
        </div>
        {pageCount > 0 && (
          <Stack direction={'row'} justifyContent="center" gap={4}>
            <Pagination
              count={pageCount}
              className={styles.pager}
              onChange={handlePaginationChange}
              page={pageNumber}
              shape="rounded"
              variant="outlined"
            />
            <TextField
              className={styles.pageNumber}
              type="number"
              size="small"
              value={requestedPageNumber}
              onChange={handlePageNumberChange}
              onKeyDown={handlePageNumberKeyDown}
              variant="outlined"
            />
          </Stack>
        )}
      </div>
    </>
  );
};

export { Gallery };

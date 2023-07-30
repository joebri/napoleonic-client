import { Button, Chip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';
import { ArtistTag } from 'types';

import styles from './ArtistsList.module.scss';
import { useArtistsList } from './useArtistsList';

const ArtistsList = () => {
  const moduleName = `${ArtistsList.name}.tsx`;

  const {
    artists,
    error,
    handleChipClick,
    handleSearchClick,
    isSearchEnabled,
    loadStatus,
  } = useArtistsList(moduleName);

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <ErrorHandler error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Uniformology: Artists</title>
      </Helmet>
      {artists.length === 0 ? (
        <Typography className={styles.noItems} variant="h5">
          No Artists available.
        </Typography>
      ) : (
        <div className={styles.container}>
          {artists.map((tag: ArtistTag, index: number) => (
            <Chip
              color="primary"
              label={`${tag.name || 'Unknown'} (${tag.count})`}
              key={index}
              onClick={() => {
                handleChipClick(index);
              }}
              variant={tag.isSelected ? undefined : 'outlined'}
            />
          ))}
          <Button
            aria-label="search"
            className={styles.button}
            disabled={!isSearchEnabled}
            onClick={handleSearchClick}
            variant="contained"
          >
            Search
          </Button>
        </div>
      )}
    </>
  );
};

export { ArtistsList };

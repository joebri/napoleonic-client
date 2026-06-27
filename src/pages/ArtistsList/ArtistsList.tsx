import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import { Loading } from '@components/Loading/Loading';
import { LoadStatus } from '@enums/loadStatus.enum';
import { ArtistTag } from '@models/ArtistTag.model';
import { Button, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './ArtistsList.module.scss';
import { useArtistsList } from './useArtistsList';

export const ArtistsList = () => {
    const moduleName = `${ArtistsList.name}.tsx`;
    const navigate = useNavigate();

    const {
        artists,
        error,
        getSelectedArtists,
        isSearchEnabled,
        loadStatus,
        updateSelectedArtists,
    } = useArtistsList(moduleName);

    const handleChipClick = (index: number) => {
        updateSelectedArtists(index);
    };

    const handleSearchClick = () => {
        const selected = getSelectedArtists();
        navigate(`/gallery?artists=${selected}`);
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }
    if (artists.length === 0) {
        return (
            <Typography className={styles.noItems} variant="h5">
                No Artists available.
            </Typography>
        );
    }
    return (
        <div className={styles.container}>
            {artists.map((tag: ArtistTag, index: number) => (
                <Chip
                    color="primary"
                    key={index}
                    label={`${tag.name || 'Unknown'} (${tag.count})`}
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
    );
};

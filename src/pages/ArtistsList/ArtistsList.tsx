import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import { Loading } from '@components/Loading/Loading';
import { LoadStatus } from '@enums/loadStatus.enum';
import { TagCount as ArtistCount } from '@models/TagCount.model';
import { Button, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './ArtistsList.module.scss';
import { useArtistsList } from './useArtistsList';

export const ArtistsList = () => {
    const moduleName = `${ArtistsList.name}.tsx`;
    const navigate = useNavigate();

    const {
        artistCounts,
        error,
        getSelectedArtistNames,
        isSearchEnabled,
        loadStatus,
        selectedArtistNames,
        updateSelectedArtists,
    } = useArtistsList(moduleName);

    const handleChipClick = (name: string) => {
        updateSelectedArtists(name);
    };

    const handleSearchClick = () => {
        const selected = getSelectedArtistNames();
        navigate(`/gallery?artists=${selected}`);
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }
    if (artistCounts.length === 0) {
        return (
            <Typography className={styles.noItems} variant="h5">
                No Artists available.
            </Typography>
        );
    }
    return (
        <div className={styles.container}>
            {artistCounts.map((artist: ArtistCount, index: number) => (
                <Chip
                    color="primary"
                    key={index}
                    label={`${artist.name || 'Unknown'} (${artist.count})`}
                    onClick={() => {
                        handleChipClick(artist.name);
                    }}
                    variant={
                        selectedArtistNames.has(artist.name)
                            ? undefined
                            : 'outlined'
                    }
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

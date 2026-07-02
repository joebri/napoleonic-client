import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import { Loading } from '@components/Loading/Loading';
import { LoadStatus } from '@enums/loadStatus.enum';
import { TagCount as RegimentCount } from '@models/TagCount.model';
import { Button, Chip, Typography } from '@mui/material';

import styles from './RegimentsList.module.scss';
import { useRegimentList } from './useRegimentList';

export const RegimentsList = () => {
    const moduleName = `${RegimentsList.name}.tsx`;

    const {
        error,
        showSelectedRegiments,
        isSearchEnabled,
        loadStatus,
        regimentCounts,
        selectedRegimentNames,
        updateSelectedRegiments,
    } = useRegimentList(moduleName);

    const handleChipClick = (name: string) => {
        updateSelectedRegiments(name);
    };

    const handleSearchClick = () => {
        showSelectedRegiments();
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }
    if (regimentCounts.length === 0) {
        return (
            <Typography className={styles.noItems} variant="h5">
                No Regiments available.
            </Typography>
        );
    }

    return (
        <div className={styles.container}>
            {regimentCounts.map((regiment: RegimentCount, index: number) => (
                <Chip
                    color="primary"
                    label={`${regiment.name || 'Unknown'} (${regiment.count})`}
                    key={index}
                    onClick={() => {
                        handleChipClick(regiment.name);
                    }}
                    variant={
                        selectedRegimentNames.has(regiment.name)
                            ? undefined
                            : 'outlined'
                    }
                />
            ))}
            <Button
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

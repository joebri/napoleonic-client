import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import { Loading } from '@components/Loading/Loading';
import { LoadStatus } from '@enums/loadStatus.enum';
import { TagCount } from '@models/TagCount.model';
import { Button, Chip, Typography } from '@mui/material';

import styles from './TagsList.module.scss';
import { useTagsList } from './useTagsList';

export const TagsList = () => {
    const moduleName = `${TagsList.name}.tsx`;

    const {
        tagCounts,
        error,
        isSearchEnabled,
        loadStatus,
        updateSelectedTagNames,
        showSelectedTags,
        selectedTagNames,
    } = useTagsList(moduleName);

    const handleChipClick = (name: string) => {
        updateSelectedTagNames(name);
    };

    const handleSearchClick = () => {
        showSelectedTags();
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }
    if (tagCounts.length === 0) {
        return (
            <Typography className={styles.noItems} variant="h5">
                No Tags available.
            </Typography>
        );
    }
    return (
        <div className={styles.container}>
            {tagCounts.map((tagCount: TagCount, index: number) => (
                <Chip
                    color="primary"
                    key={index}
                    label={`${tagCount.name || 'Unknown'} (${tagCount.count})`}
                    onClick={() => {
                        handleChipClick(tagCount.name);
                    }}
                    variant={
                        selectedTagNames.has(tagCount.name)
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

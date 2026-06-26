import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import { Loading } from '@components/Loading/Loading';
import { LoadStatus } from '@enums/loadStatus.enum';
import { ItemTag } from '@models/ItemTag.model';
import { Tag } from '@models/Tag.model';
import { Button, Chip, Typography } from '@mui/material';
import { useTagsState } from '@state/tags.state';
import { useNavigate } from 'react-router-dom';

import styles from './TagsList.module.scss';
import { useTagsListViewModel } from './useTagsListViewModel';

export const TagsListView = () => {
    const moduleName = `${TagsListView.name}.tsx`;
    const navigate = useNavigate();
    const [, setTags] = useTagsState();

    const {
        itemTags,
        error,
        isSearchEnabled,
        loadStatus,
        updateSelectedItemTags,
    } = useTagsListViewModel(moduleName);

    const handleChipClick = (index: number) => {
        updateSelectedItemTags(index);
    };

    const handleSearchClick = () => {
        setTags(itemTags as unknown as Tag[]);
        navigate(`/gallery`);
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }
    if (itemTags.length === 0) {
        return (
            <Typography className={styles.noItems} variant="h5">
                No Tags available.
            </Typography>
        );
    }
    return (
        <div className={styles.container}>
            {itemTags.map((itemTag: ItemTag, index: number) => (
                <Chip
                    color="primary"
                    key={index}
                    label={`${itemTag.name || 'Unknown'} (${itemTag.count})`}
                    onClick={() => {
                        handleChipClick(index);
                    }}
                    variant={itemTag.isSelected ? undefined : 'outlined'}
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

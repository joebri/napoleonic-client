import { Drawer } from '@mui/material';
import { useIsFilterOpenState } from '@state';

import styles from './FilterDraw.module.scss';
import { FilterDrawerContent } from './FilterDrawContent';

export enum ActionEnum {
    Search,
    ShowArtists,
    ShowBattles,
    ShowCollections,
    ShowRegiments,
    ShowAllTags,
}

type FilterDrawerProps = {
    onActionSelect: Function;
};

export const FilterDrawer = ({ onActionSelect }: FilterDrawerProps) => {
    const [isFilterOpen, setIsFilterOpen] = useIsFilterOpenState();

    const handleDrawerClose = () => {
        setIsFilterOpen(false);
    };

    return (
        <Drawer
            className={styles.filters}
            anchor={'right'}
            open={isFilterOpen}
            onClose={handleDrawerClose}
        >
            {isFilterOpen && (
                <FilterDrawerContent
                    key={String(isFilterOpen)}
                    onActionSelect={onActionSelect}
                />
            )}
        </Drawer>
    );
};

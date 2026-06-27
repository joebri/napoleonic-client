import { MenuMain } from '@components/MenuMain/MenuMain';
import { MenuSort } from '@components/MenuSort/MenuSort';
import { NavigationTag } from '@models/NavigationTag.model';
import SearchIcon from '@mui/icons-material/Search';
import {
    AppBar,
    Chip,
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import {
    useHeaderTitleStateGet,
    useIsFilterOpenStateSet,
    useNavigationTagsStateGet,
    usePageNumberStateSet,
} from '@state';
import { useNavigate } from 'react-router-dom';

import styles from './MenuBar.module.scss';

export const MenuBar = () => {
    const navigate = useNavigate();

    const headerTitle = useHeaderTitleStateGet();
    const navigationTags = useNavigationTagsStateGet();
    const setIsFilterOpen = useIsFilterOpenStateSet();
    const setPageNumber = usePageNumberStateSet();

    const handleFilterClick = () => {
        setIsFilterOpen(true);
    };

    const handleNavigationTagClick = (navigationTag: NavigationTag) => {
        setPageNumber(1);
        navigate(navigationTag.url);
    };

    return (
        <AppBar className={styles.appbar}>
            <Toolbar>
                <Stack direction="row" className={styles.appbar__left}>
                    <Typography variant="h4">{headerTitle}</Typography>
                    {navigationTags.map(
                        (navigationTag: NavigationTag, ix: number) => (
                            <span key={ix}>
                                {navigationTag.isNavigationTag ? (
                                    <Chip
                                        className={styles.chip}
                                        label={navigationTag.title}
                                        onClick={() =>
                                            handleNavigationTagClick(
                                                navigationTag
                                            )
                                        }
                                        variant={'outlined'}
                                    />
                                ) : (
                                    <Chip
                                        className={styles.chip}
                                        label={navigationTag.title}
                                        variant={'filled'}
                                    />
                                )}
                            </span>
                        )
                    )}
                </Stack>

                <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                    <MenuMain />

                    <MenuSort />

                    <IconButton
                        aria-label="menu"
                        color="inherit"
                        edge="start"
                        onClick={handleFilterClick}
                        size="small"
                    >
                        <SearchIcon className={styles.icon} />
                        Search
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

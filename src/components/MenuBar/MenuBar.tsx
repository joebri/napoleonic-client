import { useAuth0 } from '@auth0/auth0-react';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { MenuMain } from 'components/MenuMain/MenuMain';
import { MenuSort } from 'components/MenuSort/MenuSort';
import { Profile } from 'components/Profile/Profile';

import {
  useHeaderTitleStateGet,
  useIsFilterOpenStateSet,
  useNavigationTagsStateGet,
} from 'state';
import { NavigationTag } from 'types';

import styles from './MenuBar.module.scss';

const MenuBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const headerTitle = useHeaderTitleStateGet();
  const navigationTags = useNavigationTagsStateGet();
  const setIsFilterOpen = useIsFilterOpenStateSet();

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleNavigationTagClick = (navigationTag: NavigationTag) => {
    navigate(navigationTag.url);
  };

  return (
    <AppBar className={styles.appbar}>
      <Toolbar>
        <Stack direction="row" className={styles.appbar__left}>
          <Typography variant="h4">{headerTitle}</Typography>
          {navigationTags.map((navigationTag: NavigationTag, ix: number) => (
            <span key={ix}>
              {navigationTag.isNavigationTag ? (
                <Chip
                  className={styles.chip}
                  label={navigationTag.title}
                  onClick={() => handleNavigationTagClick(navigationTag)}
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
          ))}
        </Stack>

        <Stack direction="row" gap={3}>
          {isAuthenticated && (
            <>
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

              <Profile />
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export { MenuBar };

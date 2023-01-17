/** @jsxImportSource @emotion/react */

import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { classes } from './MenuBar.style';
import { SortMenu } from 'components/SortMenu/SortMenu';
import { useAppContext } from 'AppContext';
import { NavigationTag } from 'types';

const MenuBar = () => {
  const navigate = useNavigate();

  const { setIsFilterOpen, navigationTags, headerTitle } = useAppContext();

  const handleAddItemClick = () => {
    navigate(`/itemDetailAdd`);
  };

  const handleAddCollectionClick = () => {
    navigate(`/collectionDetailAdd`);
  };

  const handleSettingsClick = () => {
    navigate(`/settings`);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleNavigationTagClick = (navigationTag: NavigationTag) => {
    navigate(navigationTag.url);
  };

  return (
    <AppBar css={classes.appbar}>
      <Toolbar>
        <Stack direction="row" css={classes.appbar__left}>
          <Typography variant="h4">{headerTitle}</Typography>
          {navigationTags.map((navigationTag: NavigationTag, ix: number) => (
            <span key={ix}>
              {navigationTag.isNavigationTag ? (
                <Chip
                  css={classes.chip}
                  label={navigationTag.title}
                  onClick={() => handleNavigationTagClick(navigationTag)}
                  variant={'outlined'}
                />
              ) : (
                <Chip
                  css={classes.chip}
                  label={navigationTag.title}
                  variant={'filled'}
                />
              )}
            </span>
          ))}
        </Stack>

        <Stack direction="row" gap={3}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleSettingsClick}
            size="small"
          >
            <SettingsOutlinedIcon css={classes.icon} />
            Settings
          </IconButton>

          <IconButton
            color="inherit"
            edge="start"
            onClick={handleAddItemClick}
            size="small"
          >
            <AddIcon css={classes.icon} />
            Add
          </IconButton>

          <IconButton
            color="inherit"
            edge="start"
            onClick={handleAddCollectionClick}
            size="small"
          >
            <AddIcon css={classes.icon} />
            Add Collection
          </IconButton>

          <SortMenu />

          <IconButton
            aria-label="menu"
            color="inherit"
            edge="start"
            onClick={handleFilterClick}
            size="small"
          >
            <SearchIcon css={classes.icon} />
            Search
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export { MenuBar };

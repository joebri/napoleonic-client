/** @jsxImportSource @emotion/react */

import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Button,
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

import { Tag } from 'types/Tag.type';
import { useAppContext } from 'AppContext';

const MenuBar = () => {
  const navigate = useNavigate();

  const { setIsFilterOpen, tags, setTags } = useAppContext();

  const handleGalleryClick = () => {
    navigate(`/`);
  };

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

  const handleTagClick = (tag: Tag) => {
    if (tag.itemId) {
      const updatedTags: Tag[] = tags.map((tag: Tag) => {
        tag.isSelected = false;
        return tag;
      });

      setTags(updatedTags);
      const collectionUri = `/collectionDetailView/${tag.itemId || ''}`;
      navigate(collectionUri);
    }
  };

  return (
    <AppBar css={classes.appbar}>
      <Toolbar>
        <span css={classes.appbar__left}>
          <Button color="inherit" onClick={handleGalleryClick} variant="text">
            <Typography variant="h6">Gallery</Typography>
          </Button>
          {tags
            .filter((tag: Tag) => tag.isSelected)
            .map((tag: Tag, ix: number) => (
              <Chip
                css={classes.chip}
                key={ix}
                label={tag.name}
                onClick={() => handleTagClick(tag)}
                variant={'outlined'}
              />
            ))}
        </span>
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

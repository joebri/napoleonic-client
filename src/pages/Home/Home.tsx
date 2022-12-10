/** @jsxImportSource @emotion/react */

import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AppBar,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLazyQuery } from '@apollo/client';

import { classes } from './Home.style';
import { AppContext } from '../appContext';
import { ArtistsList } from '../ArtistsList/ArtistsList';
import { CollectionList } from '../CollectionList/CollectionList';
import { RegimentsList } from '../RegimentsList/RegimentsList';
import { Gallery } from '../Gallery/Gallery';
import { SortMenu } from '../../components/SortMenu/SortMenu';
import {
  ActionEnum,
  FilterDrawer,
} from '../../components/FilterDrawer/FilterDrawer';
import { ItemDetailEdit } from '../ItemDetail/ItemDetailEdit';
import { ItemDetailView } from '../ItemDetail/ItemDetailView';
import { ItemDetailAdd } from '../ItemDetail/ItemDetailAdd';
import readTagsQuery from './readTagsQuery';
import { Settings } from '../Settings/Settings';
import { Tag } from '../../interfaces/tag.interface';

const Home = () => {
  const navigate = useNavigate();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState('title');
  const [tags, setTags] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [getTags, { error }] = useLazyQuery(readTagsQuery, {
    onCompleted: (data) => {
      setTags(data.readTags);
    },
    onError: (exception) => {
      console.error(exception);
      setTags([]);
    },
  });

  useEffect(() => {
    getTags();
  }, []);

  const context: any = useMemo(
    () => ({
      isFilterOpen,
      setIsFilterOpen,
      sortField,
      setSortField,
      tags,
      setTags,
    }),
    [isFilterOpen, sortField, tags]
  );

  const handleGalleryClick = () => {
    navigate(`/`);
  };

  const handleAddClick = () => {
    navigate(`/itemDetailAdd`);
  };

  const handleSettingsClick = () => {
    navigate(`/settings`);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleFilterDrawAction = (action: ActionEnum, selectedTags: Tag[]) => {
    if (action === ActionEnum.ShowArtists) {
      navigate(`/artists`);
      return;
    }

    if (action === ActionEnum.ShowCollections) {
      navigate(`/collections`);
      return;
    }

    const tagNames = selectedTags.map((selectedTag) => selectedTag.name);
    if (action === ActionEnum.ShowRegiments) {
      navigate(`/regiments?tags=${tagNames.join(',')}`);
      return;
    }

    // This triggers refresh of gallery
    //TODO JSB do we need to do this every time?
    setTags((tags) => {
      return [...tags];
    });

    searchParams.delete('artists');
    searchParams.delete('regiments');
    searchParams.delete('tags');
    setSearchParams(searchParams);

    navigate(`/`);
  };

  return (
    <div css={classes.container}>
      <AppContext.Provider value={context}>
        <AppBar css={classes.appbar} position="relative">
          <Toolbar>
            <span css={classes.appbar__left}>
              <Button
                color="inherit"
                onClick={handleGalleryClick}
                variant="text"
              >
                <Typography variant="h6">Gallery</Typography>
              </Button>
              {tags
                .filter((tag: Tag) => tag.isSelected)
                .map((tag: Tag) => (
                  <Chip
                    css={classes.chip}
                    label={tag.name}
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
                <SettingsIcon css={classes.icon} />
                Settings
              </IconButton>

              <IconButton
                color="inherit"
                edge="start"
                onClick={handleAddClick}
                size="small"
              >
                <AddIcon css={classes.icon} />
                Add
              </IconButton>

              <SortMenu />

              <IconButton
                aria-label="menu"
                color="inherit"
                edge="start"
                onClick={handleFilterClick}
                size="small"
              >
                <FilterAltIcon css={classes.icon} />
                Filter
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        <div css={classes.content}>
          <FilterDrawer onActionSelect={handleFilterDrawAction} />
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="artists" element={<ArtistsList />} />
            <Route path="collections" element={<CollectionList />} />
            <Route path="regiments" element={<RegimentsList />} />
            <Route path="itemDetailEdit/:itemId" element={<ItemDetailEdit />} />
            <Route path="itemDetailView/:itemId" element={<ItemDetailView />} />
            <Route path="itemDetailAdd/" element={<ItemDetailAdd />} />
            <Route path="settings/" element={<Settings />} />
          </Routes>
        </div>
      </AppContext.Provider>
    </div>
  );
};

export { Home };

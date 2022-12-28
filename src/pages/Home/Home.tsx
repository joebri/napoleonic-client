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
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useLazyQuery } from '@apollo/client';

import { classes } from './Home.style';
import { useAppContext } from '../../AppContext';
import { ArtistsList } from '../ArtistsList/ArtistsList';
import { BattlesList } from '../BattlesList/BattlesList';
import { CollectionList } from '../CollectionList/CollectionList';
import { CollectionDetailView } from '../CollectionDetail/CollectionDetailView';
import { CollectionDetailEdit } from '../CollectionDetail/CollectionDetailEdit';
import { CollectionDetailAdd } from '../CollectionDetail/CollectionDetailAdd';
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
import readTagsQuery from './queries/readTagsQuery';
import { Settings } from '../Settings/Settings';
import { Tag } from '../../types/Tag.type';

const Home = () => {
  const navigate = useNavigate();

  const { setIsFilterOpen, setPageNumber, tags, setTags } = useAppContext();

  const [searchParams, setSearchParams] = useSearchParams();

  const [getTags, {}] = useLazyQuery(readTagsQuery, {
    onCompleted: (data) => {
      const mergedTags = [
        ...data.readTags,
        {
          group: 'Collection',
          name: '1793 Artaria',
          itemId: `63a1c6a0f54107da9771a75c`,
        } as Tag,
        {
          group: 'Collection',
          name: 'Friedrich von Koeller Collection',
          itemId: `6399233689a2743cd476e42d`,
        } as Tag,
      ];
      setTags(mergedTags);
    },
    onError: (exception) => {
      console.error(exception);
      setTags([]);
    },
  });

  useEffect(() => {
    getTags();
  }, []);

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

  const handleFilterDrawAction = (action: ActionEnum) => {
    setPageNumber(1);

    if (action === ActionEnum.ShowArtists) {
      navigate(`/artists`);
      return;
    }

    if (action === ActionEnum.ShowBattles) {
      navigate(`/battles`);
      return;
    }

    if (action === ActionEnum.ShowCollections) {
      navigate(`/collections`);
      return;
    }

    // const tagNames = selectedTags.map((selectedTag) => selectedTag.name);
    if (action === ActionEnum.ShowRegiments) {
      // navigate(`/regiments?tags=${tagNames.join(',')}`);
      navigate(`/regiments`);
      return;
    }

    // This triggers refresh of gallery
    // setTags((tags: any) => {
    //   return [...tags];
    // });

    searchParams.delete('artists');
    searchParams.delete('regiments');
    searchParams.delete('tags');
    setSearchParams(searchParams);

    navigate(`/`);
  };

  const handleTagClick = (tag: Tag) => {
    if (tag.itemId) {
      const updatedTags: any = tags.map((tag: Tag) => {
        tag.isSelected = false;
        return tag;
      });

      setTags(updatedTags);
      const collectionUri = `/collectionDetailView/${tag.itemId || ''}`;
      navigate(collectionUri);
    }
  };

  return (
    <div css={classes.container}>
      <AppBar css={classes.appbar} position="relative">
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

      <div css={classes.content}>
        <FilterDrawer onActionSelect={handleFilterDrawAction} />
        <Routes>
          <Route path="/" element={<Gallery />} />

          <Route path="artists" element={<ArtistsList />} />
          <Route path="battles" element={<BattlesList />} />
          <Route path="regiments" element={<RegimentsList />} />
          <Route path="settings/" element={<Settings />} />

          <Route path="collections" element={<CollectionList />} />
          <Route
            path="collectionDetailView/:itemId"
            element={<CollectionDetailView />}
          />
          <Route
            path="collectionDetailEdit/:itemId"
            element={<CollectionDetailEdit />}
          />
          <Route
            path="collectionDetailAdd/"
            element={<CollectionDetailAdd />}
          />

          <Route path="itemDetailEdit/:itemId" element={<ItemDetailEdit />} />
          <Route path="itemDetailView/:itemId" element={<ItemDetailView />} />
          <Route path="itemDetailAdd/" element={<ItemDetailAdd />} />
        </Routes>
      </div>
    </div>
  );
};

export { Home };

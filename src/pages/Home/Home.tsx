/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import {
  ActionEnum,
  FilterDrawer,
} from '../../components/FilterDrawer/FilterDrawer';
import { ArtistsList } from 'pages/ArtistsList/ArtistsList';
import { BattlesList } from 'pages/BattlesList/BattlesList';
import { classes } from './Home.style';
import { CollectionDetailAdd } from 'pages/CollectionDetail/CollectionDetailAdd';
import { CollectionDetailEdit } from 'pages/CollectionDetail/CollectionDetailEdit';
import { CollectionDetailView } from 'pages/CollectionDetail/CollectionDetailView';
import { CollectionList } from 'pages/CollectionList/CollectionList';
import { Gallery } from 'pages/Gallery/Gallery';
import { ItemDetailAdd } from 'pages/ItemDetail/ItemDetailAdd';
import { ItemDetailEdit } from 'pages/ItemDetail/ItemDetailEdit';
import { ItemDetailView } from 'pages/ItemDetail/ItemDetailView';
import { MenuBar } from 'components/MenuBar/MenuBar';
import { RegimentsList } from 'pages/RegimentsList/RegimentsList';
import { Settings } from 'pages/Settings/Settings';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useAppContext } from 'AppContext';
import { useLogError } from 'hooks/useLogError';
import readTagsQuery from './queries/readTagsQuery';

const Home = () => {
  const navigate = useNavigate();
  const { setPageNumber, setTags } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logError } = useLogError(Home.name);

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [getTags, { error }] = useLazyQuery(readTagsQuery, {
    onCompleted: (data) => {
      console.log('tags read');
      setTags(data.readTags);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({ name: 'getTags', exception });
      setTags([]);
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    getTags();
  }, [getTags]);

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

    if (action === ActionEnum.ShowRegiments) {
      navigate(`/regiments`);
      return;
    }

    searchParams.delete('artists');
    searchParams.delete('regiments');
    searchParams.delete('tags');
    setSearchParams(searchParams);

    navigate(`/`);
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading..</p>;
  if (loadStatus === LoadStatus.ERROR) return <p>Error: {error?.message}</p>;

  return (
    <div css={classes.container}>
      <MenuBar></MenuBar>
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
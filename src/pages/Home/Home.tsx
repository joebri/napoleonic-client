/** @jsxImportSource @emotion/react */

import { useLazyQuery } from '@apollo/client';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';

import { AuthenticationGuard } from 'components/AuthenticationGuard/AuthenticationGuard';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { MenuBar } from 'components/MenuBar/MenuBar';

import { CollectionList } from 'pages/CollectionList/CollectionList';
import { Gallery } from 'pages/Gallery/Gallery';
import { ItemDetailAdd } from 'pages/ItemDetail/ItemDetailAdd';
import { ItemDetailEdit } from 'pages/ItemDetail/ItemDetailEdit';
import { ItemDetailView } from 'pages/ItemDetail/ItemDetailView';
import { NotFound } from 'pages/NotFound/NotFound';

import { Sandbox } from 'pages/Sandbox/Sandbox';
import { Settings } from 'pages/Settings/Settings';
import {
  ActionEnum,
  FilterDrawer,
} from '../../components/FilterDrawer/FilterDrawer';
import { classes } from './Home.style';

import { LoadStatus } from 'enums/loadStatus.enum';
import { Login } from 'pages/Login/Login';
import { usePageNumberStateSet, useTagsState } from 'state';
import { logError } from 'utilities/logError';
import { readTagsQuery } from './queries/readTagsQuery';
import { useAuth0 } from '@auth0/auth0-react';

const ArtistsList = lazy(() =>
  import('pages/ArtistsList/ArtistsList').then((module) => ({
    default: module.ArtistsList,
  }))
);
const BattlesList = lazy(() =>
  import('pages/BattlesList/BattlesList').then((module) => ({
    default: module.BattlesList,
  }))
);
const CollectionDetailAdd = lazy(() =>
  import('pages/CollectionDetail/CollectionDetailAdd').then((module) => ({
    default: module.CollectionDetailAdd,
  }))
);
const CollectionDetailEdit = lazy(() =>
  import('pages/CollectionDetail/CollectionDetailEdit').then((module) => ({
    default: module.CollectionDetailEdit,
  }))
);
const CollectionDetailView = lazy(() =>
  import('pages/CollectionDetail/CollectionDetailView').then((module) => ({
    default: module.CollectionDetailView,
  }))
);
const RegimentsList = lazy(() =>
  import('pages/RegimentsList/RegimentsList').then((module) => ({
    default: module.RegimentsList,
  }))
);

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleName = `${Home.name}.tsx`;

  const { isAuthenticated } = useAuth0();

  const setPageNumber = usePageNumberStateSet();
  const [tags, setTags] = useTagsState();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [getTags, { error }] = useLazyQuery(readTagsQuery, {
    onCompleted: (data) => {
      // When Authenticating from this page, the query is being re-run.
      if (tags.length === 0) {
        setTags(data.readTags);
        setLoadStatus(LoadStatus.LOADED);
      }
    },
    onError: (exception) => {
      logError({ moduleName, name: 'getTags', exception });
      setTags([]);
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      setLoadStatus(LoadStatus.LOADING);
      getTags();
    } else {
      setLoadStatus(LoadStatus.LOADED);
    }
  }, [getTags, isAuthenticated]);

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

    navigate(`/gallery`);
  };

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <ErrorHandler error={error} />;
  }

  return (
    <div css={classes.container}>
      <MenuBar></MenuBar>
      <div css={classes.content}>
        <FilterDrawer onActionSelect={handleFilterDrawAction} />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Login />} />

          <Route
            path="artists"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthenticationGuard component={ArtistsList} />
              </Suspense>
            }
          />
          <Route
            path="gallery"
            element={<AuthenticationGuard component={Gallery} />}
          />
          <Route
            path="battles"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthenticationGuard component={BattlesList} />
              </Suspense>
            }
          />
          <Route
            path="regiments"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthenticationGuard component={RegimentsList} />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={<AuthenticationGuard component={Settings} />}
          />
          <Route
            path="collections"
            element={<AuthenticationGuard component={CollectionList} />}
          />
          <Route
            path="collectionDetailView/:collectionId"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthenticationGuard component={CollectionDetailView} />
              </Suspense>
            }
          />
          <Route
            path="collectionDetailEdit/:collectionId"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthenticationGuard component={CollectionDetailEdit} />
              </Suspense>
            }
          />
          <Route
            path="collectionDetailAdd/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthenticationGuard component={CollectionDetailAdd} />
              </Suspense>
            }
          />
          <Route
            path="itemDetailView/:itemId"
            element={<AuthenticationGuard component={ItemDetailView} />}
          />
          <Route
            path="itemDetailEdit/:itemId"
            element={<AuthenticationGuard component={ItemDetailEdit} />}
          />
          <Route
            path="itemDetailAdd/"
            element={<AuthenticationGuard component={ItemDetailAdd} />}
          />

          <Route path="loading" element={<Loading />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export { Home };

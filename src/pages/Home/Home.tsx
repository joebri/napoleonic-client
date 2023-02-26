/** @jsxImportSource @emotion/react */

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

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
import { FilterDrawer } from '../../components/FilterDrawer/FilterDrawer';
import { classes } from './Home.style';

import { LoadStatus } from 'enums/loadStatus.enum';
import { Login } from 'pages/Login/Login';
import { useHome } from './useHome';

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
  import('pages/RegimentsList/RegimentsList').then((module) => {
    return {
      default: module.RegimentsList,
    };
  })
);

const Home = () => {
  const moduleName = `${Home.name}.tsx`;

  const { error, handleFilterDrawAction, loadStatus } = useHome(moduleName);

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
              <Suspense fallback={<Loading />}>
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
              <Suspense fallback={<Loading />}>
                <AuthenticationGuard component={BattlesList} />
              </Suspense>
            }
          />
          <Route
            path="regiments"
            element={
              <Suspense fallback={<Loading />}>
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
              <Suspense fallback={<Loading />}>
                <AuthenticationGuard component={CollectionDetailView} />
              </Suspense>
            }
          />
          <Route
            path="collectionDetailEdit/:collectionId"
            element={
              <Suspense fallback={<Loading />}>
                <AuthenticationGuard component={CollectionDetailEdit} />
              </Suspense>
            }
          />
          <Route
            path="collectionDetailAdd/"
            element={
              <Suspense fallback={<Loading />}>
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

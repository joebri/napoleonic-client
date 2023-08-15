import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthenticationGuard } from 'components/AuthenticationGuard/AuthenticationGuard';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { MenuBar } from 'components/MenuBar/MenuBar';

import { LoadStatus } from 'enums/loadStatus.enum';
import { CollectionList } from 'pages/CollectionList/CollectionList';
import { Gallery } from 'pages/Gallery/Gallery';
import { ItemDetailAdd } from 'pages/ItemDetail/ItemDetailAdd';
import { ItemDetailEdit } from 'pages/ItemDetail/ItemDetailEdit';
import { ItemDetailView } from 'pages/ItemDetail/ItemDetailView';
import { Login } from 'pages/Login/Login';
import { NotFound } from 'pages/NotFound/NotFound';
import { Sandbox } from 'pages/Sandbox/Sandbox';
import { Settings } from 'pages/Settings/Settings';

import { FilterDrawer } from '../../components/FilterDrawer/FilterDrawer';
import styles from './Home.module.scss';
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
    <div className={styles.container}>
      <MenuBar />
      <div className={styles.content}>
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
            element={
              <Suspense fallback={<Loading />}>
                <AuthenticationGuard component={Gallery} />
              </Suspense>
            }
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
            element={
              <Suspense fallback={<Loading />}>
                <AuthenticationGuard component={Settings} />
              </Suspense>
            }
          />
          <Route
            path="collections"
            element={
              <Suspense fallback={<Loading />}>
                <AuthenticationGuard component={CollectionList} />
              </Suspense>
            }
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
            element={
              <Suspense fallback={<Loading />}>
                <AuthenticationGuard component={ItemDetailView} />
              </Suspense>
            }
          />
          <Route
            path="itemDetailEdit/:itemId"
            element={
              <Suspense fallback={<Loading />}>
                <AuthenticationGuard component={ItemDetailEdit} />
              </Suspense>
            }
          />
          <Route
            path="itemDetailAdd/"
            element={
              <Suspense fallback={<Loading />}>
                <AuthenticationGuard component={ItemDetailAdd} />
              </Suspense>
            }
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

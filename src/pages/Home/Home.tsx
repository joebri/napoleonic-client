/** @jsxImportSource @emotion/react */

import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';

import { AuthenticationGuard } from 'components/AuthenticationGuard/AuthenticationGuard';
import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { MenuBar } from 'components/MenuBar/MenuBar';
import { ArtistsList } from 'pages/ArtistsList/ArtistsList';
import { BattlesList } from 'pages/BattlesList/BattlesList';
import { CollectionDetailAdd } from 'pages/CollectionDetail/CollectionDetailAdd';
import { CollectionDetailEdit } from 'pages/CollectionDetail/CollectionDetailEdit';
import { CollectionDetailView } from 'pages/CollectionDetail/CollectionDetailView';
import { CollectionList } from 'pages/CollectionList/CollectionList';
import { Gallery } from 'pages/Gallery/Gallery';
import { ItemDetailAdd } from 'pages/ItemDetail/ItemDetailAdd';
import { ItemDetailEdit } from 'pages/ItemDetail/ItemDetailEdit';
import { ItemDetailView } from 'pages/ItemDetail/ItemDetailView';
import { NotFound } from 'pages/NotFound/NotFound';
import { RegimentsList } from 'pages/RegimentsList/RegimentsList';
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
            element={<AuthenticationGuard component={ArtistsList} />}
          />
          <Route
            path="gallery"
            element={<AuthenticationGuard component={Gallery} />}
          />
          <Route
            path="battles"
            element={<AuthenticationGuard component={BattlesList} />}
          />
          <Route
            path="regiments"
            element={<AuthenticationGuard component={RegimentsList} />}
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
            element={<AuthenticationGuard component={CollectionDetailView} />}
          />
          <Route
            path="collectionDetailEdit/:collectionId"
            element={<AuthenticationGuard component={CollectionDetailEdit} />}
          />
          <Route
            path="collectionDetailAdd/"
            element={<AuthenticationGuard component={CollectionDetailAdd} />}
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

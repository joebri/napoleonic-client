import { useLazyQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { usePageNumberStateSet, useTagsState } from 'state';
import { logError } from 'utilities/logError';

import { ActionEnum } from '../../components/FilterDrawer/FilterDrawer';
import { readTagsQuery } from './queries/readTagsQuery';

const useHome = (moduleName: string) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  return {
    error,
    handleFilterDrawAction,
    loadStatus,
  };
};

export { useHome };

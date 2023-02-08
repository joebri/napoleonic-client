/** @jsxImportSource @emotion/react */

import { useLazyQuery } from '@apollo/client';
import { Button, Chip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { classes } from './BattlesList.style';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { useHeaderTitleStateSet, useRatingsStateGet } from 'state';
import { BattleTag } from 'types';
import { ratingsToArray } from 'utilities/helper';
import { logError } from 'utilities/logError';
import { readBattleCountsQuery } from './queries/readBattleCountsQuery';

const BattlesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const moduleName = `${BattlesList.name}.tsx`;

  const setHeaderTitle = useHeaderTitleStateSet();
  const ratings = useRatingsStateGet();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [battles, setBattles] = useState([] as BattleTag[]);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const { clearHeaderNavigationTags } = useNavigationTags();

  const [readBattleCounts, { error }] = useLazyQuery(readBattleCountsQuery, {
    onCompleted: (data) => {
      setBattles(data.readBattleCounts);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({ moduleName, name: 'readBattleCounts', exception });
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    setHeaderTitle('Battles');
    clearHeaderNavigationTags();
  }, [clearHeaderNavigationTags, setHeaderTitle]);

  useEffect(() => {
    const selectedRatings = ratingsToArray(ratings);

    readBattleCounts({
      variables: {
        ratings: selectedRatings,
      },
    });
  }, [location.key, ratings, readBattleCounts]);

  const handleChipClick = (index: number) => {
    let newBattles: BattleTag[] = battles.map((battle) => {
      return { ...battle };
    });
    newBattles[index].isSelected = !newBattles[index].isSelected;

    const isAnySelected = newBattles.some((battle: BattleTag) => {
      return battle.isSelected;
    });
    setIsSearchEnabled(isAnySelected);

    setBattles(newBattles);
  };

  const handleSearchClick = () => {
    const selected = encodeURIComponent(
      battles
        .filter((battle: BattleTag) => battle.isSelected)
        .map((battle) => battle.name)
        .join('||')
    );
    navigate(`/gallery?battles=${selected}`);
  };

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <ErrorHandler error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Uniformology: Battles</title>
      </Helmet>

      {battles.length === 0 ? (
        <Typography css={classes.noItems} variant="h5">
          No Battles available.
        </Typography>
      ) : (
        <div css={classes.container}>
          {battles.map((battle: BattleTag, index: number) => (
            <Chip
              color="primary"
              label={`${battle.name || 'Unknown'} (${battle.count})`}
              key={index}
              onClick={() => {
                handleChipClick(index);
              }}
              variant={battle.isSelected ? undefined : 'outlined'}
            />
          ))}
          <Button
            aria-label="search"
            css={classes.button}
            disabled={!isSearchEnabled}
            onClick={handleSearchClick}
            variant="contained"
          >
            Search
          </Button>
        </div>
      )}
    </>
  );
};

export { BattlesList };

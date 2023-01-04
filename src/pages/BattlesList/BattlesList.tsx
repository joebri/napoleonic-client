/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Button, Chip, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { classes } from './BattlesList.style';
import { Error } from 'components/Error/Error';
import { Loading } from 'components/Loading/Loading';

import { BattleTag } from 'types';
import { LoadStatus } from 'enums/loadStatus.enum';
import { ratingsToArray } from 'helper';
import { useAppContext } from 'AppContext';
import { useLogError } from 'hooks/useLogError';
import readBattleCountsQuery from './queries/readBattleCountsQuery';

const BattlesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logError } = useLogError(BattlesList.name);
  const { ratings } = useAppContext();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [battles, setBattles] = useState([] as BattleTag[]);

  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const errorRef: any = useRef();

  const [readBattleCounts, { error }] = useLazyQuery(readBattleCountsQuery, {
    onCompleted: (data) => {
      setBattles(data.readBattleCounts);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({ name: 'readBattleCounts', exception });
      errorRef.current = exception;
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    const selectedRatings = ratingsToArray(ratings);

    readBattleCounts({
      variables: {
        ratings: selectedRatings,
        tags: [],
      },
    });
  }, [location.key, ratings, readBattleCounts]);

  const handleChipClick = (index: number) => {
    let newBattles: BattleTag[] = [...battles];
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
    navigate(`/?battles=${selected}`);
  };

  if (loadStatus === LoadStatus.LOADING) return <Loading />;
  if (loadStatus === LoadStatus.ERROR) return <Error error={error} />;

  return (
    <>
      <Helmet>
        <title>Uniformology: Battles</title>
      </Helmet>
      <div css={classes.container}>
        <Typography variant="h4" css={classes.title}>
          Battles
        </Typography>

        {battles.length === 0 ? (
          <div css={classes.noItems}>No Battles available.</div>
        ) : (
          <Stack direction={'row'} gap={1} sx={{ flexWrap: 'wrap' }}>
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
          </Stack>
        )}

        <Button
          css={classes.button}
          disabled={!isSearchEnabled}
          onClick={handleSearchClick}
          variant="contained"
        >
          Search
        </Button>
      </div>
    </>
  );
};

export { BattlesList };

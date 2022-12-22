/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Button, Chip, Stack, Typography } from '@mui/material';

import { classes } from './BattlesList.style';
import { LoadStatus } from '../../enums/loadStatus.enum';
import readBattleCountsQuery from './queries/readBattleCountsQuery';
import { BattleTag } from '../../types/BattleTag.type';

const BattlesList = () => {
  const navigate = useNavigate();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);
  const [battles, setBattles] = useState([] as BattleTag[]);
  const errorRef: any = useRef();

  useEffect(() => {
    readBattleCounts();
  }, []);

  const [readBattleCounts, {}] = useLazyQuery(readBattleCountsQuery, {
    onCompleted: (data) => {
      setBattles(data.readBattleCounts);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      console.error(exception);
      errorRef.current = exception;
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const handleChipClick = (index: number) => {
    let newBattles: BattleTag[] = [...battles];
    newBattles[index].isSelected = !newBattles[index].isSelected;
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

  if (loadStatus === LoadStatus.LOADING) return <p>Loading..</p>;
  if (loadStatus === LoadStatus.ERROR) {
    return <p>`Error: ${JSON.stringify(errorRef.current)}`</p>;
  }

  return (
    <div css={classes.container}>
      <Typography variant="h4" css={classes.title}>
        Battles
      </Typography>
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
      <Button
        variant="contained"
        css={classes.button}
        onClick={handleSearchClick}
      >
        Search
      </Button>
    </div>
  );
};

export { BattlesList };

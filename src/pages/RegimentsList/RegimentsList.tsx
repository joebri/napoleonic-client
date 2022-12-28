/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Button, Chip, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';

import { classes } from './RegimentsList.style';
import { useAppContext } from '../../AppContext';
import { LoadStatus } from '../../enums/loadStatus.enum';
import { RegimentTag } from '../../types/RegimentTag.type';
import { Tag } from '../../types/Tag.type';
import readRegimentCountsQuery from './queries/readRegimentCountsQuery';

const RegimentsList = () => {
  const navigate = useNavigate();

  const { tags } = useAppContext();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [regiments, setRegiments] = useState([] as RegimentTag[]);

  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const errorRef: any = useRef();

  useEffect(() => {
    const tagNames = tags
      .filter((tag: Tag) => {
        return tag.isSelected;
      })
      .map((tag: Tag) => {
        return tag.name;
      });
    readRegimentCounts({
      variables: {
        tags: tagNames,
      },
    });
  }, [tags]);

  const [readRegimentCounts, {}] = useLazyQuery(readRegimentCountsQuery, {
    onCompleted: (data) => {
      setRegiments(data.readRegimentCounts);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      console.error(exception);
      errorRef.current = exception;
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const handleChipClick = (index: number) => {
    let newRegiments: RegimentTag[] = [...regiments];
    newRegiments[index].isSelected = !newRegiments[index].isSelected;

    const isAnySelected = newRegiments.some((regiment: RegimentTag) => {
      return regiment.isSelected;
    });
    setIsSearchEnabled(isAnySelected);

    setRegiments(newRegiments);
  };

  const handleSearchClick = () => {
    const selected = regiments
      .filter((regiment: RegimentTag) => regiment.isSelected)
      .map((regiment: RegimentTag) => encodeURIComponent(regiment.name));

    navigate(`/?regiments=${selected.join('||')}`);
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading..</p>;
  if (loadStatus === LoadStatus.ERROR)
    return <p>`Error: ${JSON.stringify(errorRef.current)}`</p>;

  return (
    <>
      <Helmet>
        <title>Uniformology: Regiments</title>
      </Helmet>
      <div css={classes.container}>
        <Stack direction={'row'}>
          <Typography variant="h4" css={classes.title}>
            Regiments
          </Typography>
        </Stack>
        <Stack direction={'row'} gap={1} sx={{ flexWrap: 'wrap' }}>
          {regiments.map((regiment: RegimentTag, index: number) => (
            <Chip
              color="primary"
              label={`${regiment.name || 'Unknown'} (${regiment.count})`}
              key={index}
              onClick={() => {
                handleChipClick(index);
              }}
              variant={regiment.isSelected ? undefined : 'outlined'}
            />
          ))}
        </Stack>
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

export { RegimentsList };

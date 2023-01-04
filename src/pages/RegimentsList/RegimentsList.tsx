/** @jsxImportSource @emotion/react */

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Button, Chip, Stack, Typography } from '@mui/material';

import { classes } from './RegimentsList.style';
import { Error } from 'components/Error/Error';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';
import { ratingsToArray } from 'helper';
import { RegimentTag } from 'types/RegimentTag.type';
import { Tag } from 'types/Tag.type';
import { useAppContext } from 'AppContext';
import { useLogError } from 'hooks/useLogError';
import readRegimentCountsQuery from './queries/readRegimentCountsQuery';

const RegimentsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ratings, tags, yearRange, includeUnknownYear } = useAppContext();
  const { logError } = useLogError(RegimentsList.name);

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [regiments, setRegiments] = useState([] as RegimentTag[]);

  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const [readRegimentCounts, { error }] = useLazyQuery(
    readRegimentCountsQuery,
    {
      onCompleted: (data) => {
        setRegiments(data.readRegimentCounts);
        setLoadStatus(LoadStatus.LOADED);
      },
      onError: (exception) => {
        logError({ name: 'readRegimentCounts', exception });
        setLoadStatus(LoadStatus.ERROR);
      },
    }
  );

  useEffect(() => {
    const selectedRatings = ratingsToArray(ratings);

    const tagNames = tags
      .filter((tag: Tag) => {
        return tag.isSelected;
      })
      .map((tag: Tag) => {
        return tag.name;
      });

    readRegimentCounts({
      variables: {
        ratings: selectedRatings,
        tags: tagNames,
        yearRange,
        includeUnknownYear,
      },
    });
  }, [
    location.key,
    ratings,
    tags,
    readRegimentCounts,
    yearRange,
    includeUnknownYear,
  ]);

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

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <Error error={error} />;
  }

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
        {regiments.length === 0 ? (
          <div>No Regiments available.</div>
        ) : (
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

export { RegimentsList };

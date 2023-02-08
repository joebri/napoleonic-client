/** @jsxImportSource @emotion/react */

import { useLazyQuery } from '@apollo/client';
import { Button, Chip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { classes } from './RegimentsList.style';

import { LoadStatus } from 'enums/loadStatus.enum';
import { logError } from 'utilities/logError';
import { useNavigationTags } from 'hooks/useNavigationTags';
import {
  useHeaderTitleStateSet,
  useIncludeUnknownYearStateGet,
  useRatingsStateGet,
  useTagsStateGet,
  useYearRangeStateGet,
} from 'state';
import { RegimentTag } from 'types/RegimentTag.type';
import { Tag } from 'types/Tag.type';
import { ratingsToArray } from 'utilities/helper';
import { readRegimentCountsQuery } from './queries/readRegimentCountsQuery';

const RegimentsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const moduleName = `${RegimentsList.name}.tsx`;

  const setHeaderTitle = useHeaderTitleStateSet();
  const includeUnknownYear = useIncludeUnknownYearStateGet();
  const ratings = useRatingsStateGet();
  const tags = useTagsStateGet();
  const yearRange = useYearRangeStateGet();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [regiments, setRegiments] = useState([] as RegimentTag[]);

  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const { clearHeaderNavigationTags } = useNavigationTags();

  const [readRegimentCounts, { error }] = useLazyQuery(
    readRegimentCountsQuery,
    {
      onCompleted: (data) => {
        setRegiments(data.readRegimentCounts);
        setLoadStatus(LoadStatus.LOADED);
      },
      onError: (exception) => {
        logError({ moduleName, name: 'readRegimentCounts', exception });
        setLoadStatus(LoadStatus.ERROR);
      },
    }
  );

  useEffect(() => {
    setHeaderTitle('Regiments');
    clearHeaderNavigationTags();
  }, [clearHeaderNavigationTags, setHeaderTitle]);

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

    navigate(`/gallery?regiments=${selected.join('||')}`);
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
        <title>Uniformology: Regiments</title>
      </Helmet>

      {regiments.length === 0 ? (
        <Typography css={classes.noItems} variant="h5">
          No Regiments available.
        </Typography>
      ) : (
        <div css={classes.container}>
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
          <Button
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

export { RegimentsList };

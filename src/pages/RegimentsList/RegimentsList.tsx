/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Button, Chip, Stack, Typography } from '@mui/material';

import { classes } from './RegimentsList.style';
import { LoadStatus } from '../../enums/loadStatus.enum';
import readRegimentCountsQuery from './queries/readRegimentCountsQuery';
import { RegimentTag } from '../../types/RegimentTag.type';

const RegimentsList = () => {
  const navigate = useNavigate();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [regiments, setRegiments] = useState([] as RegimentTag[]);

  const errorRef: any = useRef();

  const [searchParams, setSearchParams] = useSearchParams();

  const queryTagsString = searchParams.get('tags') || '';
  const tagsStringRef = useRef('');

  if (tagsStringRef.current !== queryTagsString) {
    tagsStringRef.current = queryTagsString;
  }

  useEffect(() => {
    readRegimentCounts({
      variables: {
        tags: tagsStringRef.current.split(','),
      },
    });
  }, [tagsStringRef.current]);

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
    setRegiments(newRegiments);
  };

  const handleSearchClick = () => {
    const selected = regiments
      .filter((regiment: RegimentTag) => regiment.isSelected)
      .map((regiment: RegimentTag) => encodeURIComponent(regiment.name));
    navigate(`/?regiments=${selected}`);
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading..</p>;
  if (loadStatus === LoadStatus.ERROR)
    return <p>`Error: ${JSON.stringify(errorRef.current)}`</p>;

  return (
    <div css={classes.container}>
      <Stack direction={'row'} css={classes.title}>
        <h2>Regiments </h2>
        <Typography variant="h6">
          for {tagsStringRef.current.replaceAll(',', ', ')}
        </Typography>{' '}
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
        variant="contained"
        css={classes.button}
        onClick={handleSearchClick}
      >
        Search
      </Button>
    </div>
  );
};

export { RegimentsList };

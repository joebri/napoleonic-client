/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Button, Chip, Stack, Typography } from '@mui/material';

import { classes } from './ArtistsList.style';
import { LoadStatus } from '../../enums/loadStatus.enum';
import readArtistCountsQuery from './queries/readArtistCountsQuery';
import { ArtistTag } from '../../types/ArtistTag.type';

const ArtistsList = () => {
  const navigate = useNavigate();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [artists, setArtists] = useState([] as ArtistTag[]);

  const errorRef: any = useRef();

  useEffect(() => {
    readArtistCounts();
  }, []);

  const [readArtistCounts, {}] = useLazyQuery(readArtistCountsQuery, {
    onCompleted: (data) => {
      setArtists(data.readArtistCounts);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      console.error(exception);
      errorRef.current = exception;
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  const handleChipClick = (index: number) => {
    let newArtists: ArtistTag[] = [...artists];
    newArtists[index].isSelected = !newArtists[index].isSelected;
    setArtists(newArtists);
  };

  const handleSearchClick = () => {
    const selected = encodeURIComponent(
      artists
        .filter((artist: ArtistTag) => artist.isSelected)
        .map((artist) => artist.name)
        .join('~')
    );
    console.log('selected', selected);
    navigate(`/?artists=${selected}`);
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading..</p>;
  if (loadStatus === LoadStatus.ERROR)
    return <p>`Error: ${JSON.stringify(errorRef.current)}`</p>;

  return (
    <div css={classes.container}>
      <h2 css={classes.title}>Artists</h2>
      <Stack direction={'row'} gap={1} sx={{ flexWrap: 'wrap' }}>
        {artists.map((artist: ArtistTag, index: number) => (
          <Chip
            color="primary"
            label={`${artist.name || 'Unknown'} (${artist.count})`}
            key={index}
            onClick={() => {
              handleChipClick(index);
            }}
            variant={artist.isSelected ? undefined : 'outlined'}
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

export { ArtistsList };

/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Button, Chip, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';

import { classes } from './ArtistsList.style';
import { useAppContext } from '../../AppContext';
import { LoadStatus } from '../../enums/loadStatus.enum';
import readArtistCountsQuery from './queries/readArtistCountsQuery';
import { Tag } from '../../types/Tag.type';
import { ArtistTag } from '../../types/ArtistTag.type';

const ArtistsList = () => {
  const navigate = useNavigate();

  const { tags } = useAppContext();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [artists, setArtists] = useState([] as ArtistTag[]);

  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const errorRef: any = useRef();

  const [readArtistCounts] = useLazyQuery(readArtistCountsQuery, {
    onCompleted: (data) => {
      console.log(data);
      setArtists(data.readArtistCounts);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      console.error(exception);
      errorRef.current = exception;
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    const tagNames = tags
      .filter((tag: Tag) => {
        return tag.isSelected;
      })
      .map((tag: Tag) => {
        return tag.name;
      });
    readArtistCounts({
      variables: {
        tags: tagNames,
      },
    });
  }, [tags, readArtistCounts]);

  const handleChipClick = (index: number) => {
    let newArtists: ArtistTag[] = [...artists];
    newArtists[index].isSelected = !newArtists[index].isSelected;

    const isAnySelected = newArtists.some((artist: ArtistTag) => {
      return artist.isSelected;
    });
    setIsSearchEnabled(isAnySelected);

    setArtists(newArtists);
  };

  const handleSearchClick = () => {
    const selected = encodeURIComponent(
      artists
        .filter((tag: ArtistTag) => tag.isSelected)
        .map((tag: ArtistTag) => tag.name)
        .join('||')
    );
    navigate(`/?artists=${selected}`);
  };

  if (loadStatus === LoadStatus.LOADING) return <p>Loading..</p>;
  if (loadStatus === LoadStatus.ERROR)
    return <p>`Error: ${JSON.stringify(errorRef.current)}`</p>;

  return (
    <>
      <Helmet>
        <title>Uniformology: Artists</title>
      </Helmet>
      <div css={classes.container}>
        <Typography variant="h4" css={classes.title}>
          Artists
        </Typography>
        <Stack direction={'row'} gap={1} sx={{ flexWrap: 'wrap' }}>
          {artists.map((tag: ArtistTag, index: number) => (
            <Chip
              color="primary"
              label={`${tag.name || 'Unknown'} (${tag.count})`}
              key={index}
              onClick={() => {
                handleChipClick(index);
              }}
              variant={tag.isSelected ? undefined : 'outlined'}
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

export { ArtistsList };

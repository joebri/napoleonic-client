import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadStatus } from 'enums/loadStatus.enum';
import { useNavigationTags } from 'hooks/useNavigationTags';
import {
  useHeaderTitleStateSet,
  useIncludeUnknownYearStateGet,
  useRatingsStateGet,
  useTagsStateGet,
  useYearRangeStateGet,
} from 'state';
import { ArtistTag, Tag } from 'types';
import { ratingsToArray } from 'utilities/helper';
import { logError } from 'utilities/logError';
import { readArtistCountsQuery } from './queries/readArtistCountsQuery';

const useArtistsList = (moduleName: string) => {
  const navigate = useNavigate();
  const location = useLocation();

  const includeUnknownYear = useIncludeUnknownYearStateGet();
  const ratings = useRatingsStateGet();
  const setHeaderTitle = useHeaderTitleStateSet();
  const tags = useTagsStateGet();
  const yearRange = useYearRangeStateGet();

  const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING);

  const [artists, setArtists] = useState([] as ArtistTag[]);

  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const { clearHeaderNavigationTags } = useNavigationTags();

  const [readArtistCounts, { error }] = useLazyQuery(readArtistCountsQuery, {
    onCompleted: (data) => {
      setArtists(data.readArtistCounts);
      setLoadStatus(LoadStatus.LOADED);
    },
    onError: (exception) => {
      logError({ moduleName, name: 'readArtistCounts', exception });
      setLoadStatus(LoadStatus.ERROR);
    },
  });

  useEffect(() => {
    setHeaderTitle('Artists');
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
    readArtistCounts({
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
    readArtistCounts,
    yearRange,
    includeUnknownYear,
  ]);

  const handleChipClick = (index: number) => {
    let newArtists: ArtistTag[] = artists.map((artist) => {
      return { ...artist };
    });
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
    navigate(`/gallery?artists=${selected}`);
  };

  return {
    artists,
    error,
    handleChipClick,
    handleSearchClick,
    isSearchEnabled,
    loadStatus,
  };
};

export { useArtistsList };

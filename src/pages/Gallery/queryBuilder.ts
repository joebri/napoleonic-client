import { Tag } from 'types';

type QueryParams = {
  artists: string[];
  battles: string[];
  ratings: number[];
  regiments: string[];
  tagNames: string[];
  yearRange: number[];
  includeUnknownYear: boolean;
};

const buildArtistsQueryParams = (
  queryArtists: string,
  tags: Tag[],
  selectedRatings: number[],
  yearRange: number[]
): QueryParams => {
  const artists = queryArtists.split('||');
  const tagNames = tags
    .filter((tag: Tag) => {
      return tag.isSelected === true;
    })
    .map((tag: Tag) => tag.name);
  return {
    artists,
    battles: [],
    ratings: selectedRatings,
    regiments: [],
    tagNames,
    yearRange,
    includeUnknownYear: true,
  };
};

const buildBattlesQueryParams = (
  queryBattles: string,
  selectedRatings: number[]
): QueryParams => {
  const battles = queryBattles.split('||');
  return {
    artists: [],
    battles,
    ratings: selectedRatings,
    regiments: [],
    tagNames: [],
    yearRange: [1699, 1899],
    includeUnknownYear: true,
  };
};

const buildCollectionsQueryParams = (
  queryCollection: string,
  queryTags: string | null,
  selectedRatings: number[]
): QueryParams => {
  const collectionTagName = queryCollection;
  const tagNames = queryTags?.split(',') || [];

  return {
    artists: [],
    battles: [],
    ratings: selectedRatings,
    regiments: [],
    tagNames: [...tagNames, collectionTagName],
    yearRange: [1699, 1899],
    includeUnknownYear: true,
  };
};

const buildRegimentsQueryParams = (
  queryRegiments: string,
  tags: Tag[],
  selectedRatings: number[]
): QueryParams => {
  const regiments = queryRegiments.split('||');
  const tagNames = tags
    .filter((tag: Tag) => {
      return tag.isSelected === true;
    })
    .map((tag: Tag) => tag.name);
  return {
    artists: [],
    battles: [],
    ratings: selectedRatings,
    regiments,
    tagNames,
    yearRange: [1699, 1899],
    includeUnknownYear: true,
  };
};

const buildTagsQueryParams = (
  queryTags: string | null,
  tags: Tag[],
  selectedRatings: number[],
  yearRange: number[]
): QueryParams => {
  let tagNames: string[] = [];
  if (queryTags) {
    tagNames = queryTags.split(',');
  } else {
    tagNames = tags
      .filter((tag: Tag) => {
        return tag.isSelected === true;
      })
      .map((tag: Tag) => tag.name);
  }
  return {
    artists: [],
    battles: [],
    ratings: selectedRatings,
    regiments: [],
    tagNames,
    yearRange,
    includeUnknownYear: true,
  };
};

export {
  buildArtistsQueryParams,
  buildBattlesQueryParams,
  buildCollectionsQueryParams,
  buildRegimentsQueryParams,
  buildTagsQueryParams,
};

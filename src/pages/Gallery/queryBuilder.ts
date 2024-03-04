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

interface buildArtistsQueryParamsProps {
    includeUnknownYear: boolean;
    queryArtists: string;
    selectedRatings: number[];
    tags: Tag[];
    yearRange: number[];
}

interface buildRegimentsQueryParamsProps {
    includeUnknownYear: boolean;
    queryRegiments: string;
    selectedRatings: number[];
    tags: Tag[];
}

interface buildTagsQueryParamsProps {
    includeUnknownYear: boolean;
    queryTags: string | null;
    selectedRatings: number[];
    tags: Tag[];
    yearRange: number[];
}

const buildArtistsQueryParams = ({
    includeUnknownYear,
    queryArtists,
    selectedRatings,
    tags,
    yearRange,
}: buildArtistsQueryParamsProps): QueryParams => {
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
        includeUnknownYear,
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

const buildRegimentsQueryParams = ({
    includeUnknownYear,
    queryRegiments,
    selectedRatings,
    tags,
}: buildRegimentsQueryParamsProps): QueryParams => {
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
        includeUnknownYear,
    };
};

const buildTagsQueryParams = ({
    queryTags,
    tags,
    selectedRatings,
    yearRange,
    includeUnknownYear,
}: buildTagsQueryParamsProps): QueryParams => {
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
        includeUnknownYear,
    };
};

export {
    buildArtistsQueryParams,
    buildBattlesQueryParams,
    buildCollectionsQueryParams,
    buildRegimentsQueryParams,
    buildTagsQueryParams,
};

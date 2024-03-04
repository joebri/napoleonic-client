const ratingMap = [
    { itemRating: 1, uiRating: 3 },
    { itemRating: 3, uiRating: 2 },
    { itemRating: 5, uiRating: 1 },
];

export const ratingLabels: { [index: string]: string } = {
    0: 'Unknown',
    1: 'Low',
    2: 'Medium',
    3: 'High',
};

export const toItemRating = (rating: number | null): number => {
    const ratingEntry = ratingMap.filter((entry) => {
        return entry.uiRating === rating;
    })[0];

    return ratingEntry.itemRating;
};

export const toUiRating = (rating: number | null): number => {
    const ratingEntry = ratingMap.filter((entry) => {
        return entry.itemRating === rating;
    })[0];

    return ratingEntry?.uiRating;
};

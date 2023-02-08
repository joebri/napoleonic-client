import { Collection, Item } from '../types';
import { Rating } from '../enums/rating.enum';
import { RatingsType } from '../types';

const initialisedItem: Item = {
  artist: '',
  descriptionLong: '',
  descriptionShort: '',
  id: '0',
  publicId: '',
  rating: Rating.MEDIUM,
  regiments: '',
  title: '',
  tags: [],
  yearFrom: '',
  yearTo: '',
};

const initialisedCollection: Collection = {
  descriptionLong: '',
  descriptionShort: '',
  id: '0',
  tagName: '',
  tags: [],
  title: '',
};

const ratingsToArray = (ratings: RatingsType): number[] => {
  const selectedRatings: number[] = [];
  if (ratings.high) {
    selectedRatings.push(Rating.HIGH);
  }
  if (ratings.medium) {
    selectedRatings.push(Rating.MEDIUM);
  }
  if (ratings.low) {
    selectedRatings.push(Rating.LOW);
  }
  return selectedRatings;
};

const ratingToString = (rating: number) => {
  switch (rating) {
    case Rating.HIGH:
      return 'High';
    case Rating.MEDIUM:
      return 'Medium';
    case Rating.LOW:
      return 'Low';
    default:
      return 'n/a';
  }
};

export {
  initialisedCollection,
  initialisedItem,
  ratingsToArray,
  ratingToString,
};

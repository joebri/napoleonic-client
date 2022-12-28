import { Item } from './types';
import { Rating } from './enums/rating.enum';

const initialisedItem: Item = {
  artist: '',
  contentId: '',
  descriptionLong: '',
  descriptionShort: '',
  id: '0',
  isCollection: false,
  publicId: '',
  rating: Rating.MEDIUM,
  regiments: '',
  title: '',
  tags: [],
  yearFrom: '',
  yearTo: '',
};

export { initialisedItem };

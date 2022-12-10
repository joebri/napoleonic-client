import { createContext } from 'react';

import { Tag } from '../types/Tag.type';

const AppContext = createContext({
  isFilterOpen: false,
  setIsFilterOpen: (T: any) => {},
  sortField: '',
  setSortField: (T: any) => {},
  tags: [],
  setTags: (T: Tag[]) => {},
});

export { AppContext };

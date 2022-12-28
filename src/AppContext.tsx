import { createContext, useContext, useState } from 'react';

import { Tag } from './types/Tag.type';

type RatingsType = {
  high: boolean;
  medium: boolean;
  low: boolean;
};

type AppContextType = {
  isFilterOpen: boolean;
  setIsFilterOpen: Function;
  pageNumber: number;
  setPageNumber: Function;
  ratings: RatingsType;
  setRatings: Function;
  sortField: string;
  setSortField: Function;
  tags: Tag[];
  setTags: Function;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: any) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [ratings, setRatings] = useState({
    high: true,
    medium: true,
    low: false,
  });
  const [sortField, setSortField] = useState('title');
  const [tags, setTags] = useState([]);

  const value: any = {
    isFilterOpen,
    setIsFilterOpen,
    pageNumber,
    setPageNumber,
    ratings,
    setRatings,
    sortField,
    setSortField,
    tags,
    setTags,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};

export { AppProvider, useAppContext };

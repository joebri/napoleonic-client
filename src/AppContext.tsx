import { createContext, ReactNode, useContext, useState } from 'react';

import { RatingsType, Tag } from './types';

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
  yearRange: number[];
  setYearRange: Function;
  includeUnknownYear: boolean;
  setIncludeUnknownYear: Function;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [ratings, setRatings] = useState<RatingsType>({
    high: true,
    medium: true,
    low: false,
  });
  const [sortField, setSortField] = useState('title');
  const [tags, setTags] = useState([]);
  const [yearRange, setYearRange] = useState([1795, 1815]);
  const [includeUnknownYear, setIncludeUnknownYear] = useState(false);

  const value: AppContextType = {
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
    yearRange,
    setYearRange,
    includeUnknownYear,
    setIncludeUnknownYear,
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

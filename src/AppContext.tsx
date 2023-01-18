import { createContext, ReactNode, useContext, useState } from 'react';

import { NavigationTag, RatingsType, Tag } from './types';

type AppContextType = {
  headerTitle: string;
  setHeaderTitle: Function;
  navigationTags: NavigationTag[];
  setNavigationTags: Function;
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
  const [navigationTags, setNavigationTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [headerTitle, setHeaderTitle] = useState('Gallery');
  const [ratings, setRatings] = useState<RatingsType>({
    high: true,
    medium: true,
    low: false,
  });
  const [sortField, setSortField] = useState('title');
  const [tags, setTags] = useState([]);
  const [yearRange, setYearRange] = useState([1790, 1815]);
  const [includeUnknownYear, setIncludeUnknownYear] = useState(true);

  const value: AppContextType = {
    navigationTags,
    setNavigationTags,

    isFilterOpen,
    setIsFilterOpen,

    pageNumber,
    setPageNumber,

    headerTitle,
    setHeaderTitle,

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

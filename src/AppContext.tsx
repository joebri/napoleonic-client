import * as React from 'react';

import { Tag } from './types/Tag.type';

type AppContextType = {
  isFilterOpen: boolean;
  setIsFilterOpen: Function;
  pageNumber: number;
  setPageNumber: Function;
  sortField: string;
  setSortField: Function;
  tags: Tag[];
  setTags: Function;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: any) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [sortField, setSortField] = React.useState('title');
  const [tags, setTags] = React.useState([]);

  const value: any = {
    isFilterOpen,
    setIsFilterOpen,
    pageNumber,
    setPageNumber,
    sortField,
    setSortField,
    tags,
    setTags,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = React.useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};

export { AppProvider, useAppContext };

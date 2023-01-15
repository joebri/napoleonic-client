import { NavigationTagType } from 'enums/navigationTagType.enum';

type NavigationTag = {
  type: NavigationTagType;
  title: string;
  url: string;
  isNavigationTag: boolean;
};

export type { NavigationTag };

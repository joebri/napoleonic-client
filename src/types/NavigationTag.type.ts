import { NavigationTagType } from 'enums/navigationTagType.enum';

type NavigationTag = {
    isNavigationTag: boolean;
    name?: string;
    title: string;
    type: NavigationTagType;
    url: string;
};

export type { NavigationTag };

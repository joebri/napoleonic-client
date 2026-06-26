import { NavigationTagType } from '@enums/navigationTagType.enum';

export type NavigationTag = {
    isNavigationTag: boolean;
    name?: string;
    title: string;
    type: NavigationTagType;
    url: string;
};

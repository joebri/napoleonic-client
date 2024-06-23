import { useContext } from 'react';

import { helmetContextType } from 'types';

import { helmetContext } from '../providers/HelmetProvider';

export const useHelmet = (): helmetContextType => {
    return useContext(helmetContext) as helmetContextType;
};

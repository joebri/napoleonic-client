import { useContext } from 'react';

import { helmetContext } from '../providers/HelmetProvider';
import { helmetContextType } from '../types';

export const useHelmet = (): helmetContextType => {
    return useContext(helmetContext) as helmetContextType;
};

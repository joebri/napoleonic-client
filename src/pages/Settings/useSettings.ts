import { useEffect } from 'react';

import { useHelmet } from 'hooks/useHelmet';

export const useSettings = (moduleName: string) => {
    const helmet = useHelmet();

    useEffect(() => {
        helmet.setTitle('Uniformology: Settings');
    }, [helmet]);
};

import { useEffect } from 'react';

import { useHelmet } from 'hooks/useHelmet';

export const useLogin = (moduleName: string) => {
    const helmet = useHelmet();

    useEffect(() => {
        helmet.setTitle('Uniformology: Login');
    }, [helmet]);

    return {};
};

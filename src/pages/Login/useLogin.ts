import { useHelmet } from '@hooks/useHelmet';
import { useEffect } from 'react';

export const useLogin = (moduleName: string) => {
    const helmet = useHelmet();

    useEffect(() => {
        helmet.setTitle('Uniformology: Login');
    }, [helmet]);

    return {};
};

import { withAuthenticationRequired } from '@auth0/auth0-react';
import { FunctionComponent } from 'react';

import { Loading } from 'components/Loading/Loading';

type AuthenticationGuardProps = {
    component: FunctionComponent;
};

const AuthenticationGuard = ({ component }: AuthenticationGuardProps) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => <Loading />,
        returnTo: () => window.location.pathname,
    });

    return <Component />;
};

export { AuthenticationGuard };

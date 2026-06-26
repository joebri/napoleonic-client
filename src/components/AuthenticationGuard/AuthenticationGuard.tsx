import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Loading } from '@components/Loading/Loading';
import { FunctionComponent } from 'react';

type AuthenticationGuardProps = {
    component: FunctionComponent;
};

export const AuthenticationGuard = ({
    component,
}: AuthenticationGuardProps) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => <Loading />,
        returnTo: () => window.location.pathname,
    });

    return <Component />;
};

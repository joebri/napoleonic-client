import { ApolloSandbox } from '@apollo/sandbox/react';

import styles from 'pages/Sandbox/Sandbox.module.scss';

function Sandbox() {
    return (
        <ApolloSandbox
            className={styles.container}
            initialEndpoint={import.meta.env.VITE_APP_GRAPH_URL}
            includeCookies={false}
        />
    );
}

export { Sandbox };

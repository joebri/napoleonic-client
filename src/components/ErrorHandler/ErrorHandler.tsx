import { ApolloError } from '@apollo/client';
import { Typography } from '@mui/material';

import styles from './ErrorHandler.module.scss';

interface ErrorHandlerProps {
    error: ApolloError | undefined;
}

const ErrorHandler = ({ error }: ErrorHandlerProps) => {
    return (
        <>
            <div className={styles.container}>
                <Typography variant="h1">Error!</Typography>
                {process.env.NODE_ENV === 'production' ? (
                    <p>An error has occurred.</p>
                ) : (
                    <>
                        <p>The following error has occurred:</p>
                        <p className={styles.message}>{error?.message || ''}</p>
                    </>
                )}
            </div>
        </>
    );
};

export { ErrorHandler };

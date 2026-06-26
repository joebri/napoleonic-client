import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
import { Typography } from '@mui/material';
import { GraphQLFormattedError } from 'graphql';

import styles from './ErrorHandler.module.scss';

type ErrorHandlerProps = {
    error:
        | {
              message: string;
              graphQLErrors?: ReadonlyArray<GraphQLFormattedError>;
              networkError?: Error | null;
          }
        | undefined;
};

export const ErrorHandler = ({ error }: ErrorHandlerProps) => {
    if (!error) {
        return null;
    }

    let errorMessage = '';

    if (CombinedGraphQLErrors.is(error)) {
        errorMessage = `GraphQL Error: ${error.message}`;
    } else if (ServerError.is(error.networkError)) {
        errorMessage = `Server Error: ${error.networkError.statusCode}`;
    } else {
        errorMessage = `Error: ${error.message}`;
    }

    return (
        <>
            <div className={styles.container}>
                <Typography variant="h1">Error!</Typography>
                {import.meta.env.NODE_ENV === 'production' ? (
                    <p>An error has occurred.</p>
                ) : (
                    <>
                        <p>The following error has occurred:</p>
                        <p className={styles.message}>{errorMessage}</p>
                    </>
                )}
            </div>
        </>
    );
};

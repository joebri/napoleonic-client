/** @jsxImportSource @emotion/react */

import { ApolloError } from '@apollo/client';
import { Typography } from '@mui/material';

import { classes } from './Error.style';

interface ErrorProps {
  error: ApolloError | undefined;
}

const Error = ({ error }: ErrorProps) => {
  return (
    <>
      <div css={classes.container}>
        <Typography variant="h1">Error!</Typography>
        {process.env.NODE_ENV === 'production' ? (
          <p>An error has occurred.</p>
        ) : (
          <>
            <p>The following error has occurred:</p>
            <p css={classes.message}>{error?.message || ''}</p>
          </>
        )}
      </div>
    </>
  );
};

export { Error };

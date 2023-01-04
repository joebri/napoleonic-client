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
        <Typography variant="h2">Error</Typography>
        <p>
          The following error has occurred. Please try again; if it persists,
          contact Support.
        </p>
        <p css={classes.message}>{error?.message || ''}</p>
      </div>
    </>
  );
};

export { Error };

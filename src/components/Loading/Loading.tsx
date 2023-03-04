/** @jsxImportSource @emotion/react */

import { Box, CircularProgress } from '@mui/material';

import { classes } from './Loading.style';

const Loading = () => {
  return (
    <Box css={classes.container}>
      <CircularProgress />
      Loading...
    </Box>
  );
};

export { Loading };

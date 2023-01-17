/** @jsxImportSource @emotion/react */

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

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

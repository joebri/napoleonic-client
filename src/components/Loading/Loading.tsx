import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { classes } from './Loading.style';

const Loading = () => {
  return (
    <Box sx={classes.container}>
      <CircularProgress />
      Loading...
    </Box>
  );
};

export { Loading };

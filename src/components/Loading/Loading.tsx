import { Box, CircularProgress } from '@mui/material';

import styles from './Loading.module.scss';

const Loading = () => {
  return (
    <Box className={styles.container}>
      <CircularProgress />
      Loading...
    </Box>
  );
};

export { Loading };

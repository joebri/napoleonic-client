/** @jsxImportSource @emotion/react */

import Box from '@mui/system/Box';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';

import { classes } from './NotFound.style';
import Typography from '@mui/material/Typography';

const NotFound = () => {
  return (
    <Box css={classes.container}>
      <Typography variant="h1">
        <CrisisAlertIcon css={classes.icon} />
        Page Not Found
      </Typography>
    </Box>
  );
};

export { NotFound };

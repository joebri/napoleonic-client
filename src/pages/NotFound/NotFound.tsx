/** @jsxImportSource @emotion/react */

import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import { Button, Typography } from '@mui/material';
import Box from '@mui/system/Box';
import { useNavigate } from 'react-router-dom';

import { classes } from './NotFound.style';

const NotFound = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate('/gallery');
  };

  return (
    <Box css={classes.container}>
      <Typography variant="h1">
        <CrisisAlertIcon css={classes.icon} />
        Page Not Found
      </Typography>
      <div>
        <Button onClick={handleOnClick} variant="contained">
          Go to Gallery
        </Button>
      </div>
    </Box>
  );
};

export { NotFound };

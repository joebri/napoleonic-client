import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import { Button, Typography } from '@mui/material';
import Box from '@mui/system/Box';
import { useNavigate } from 'react-router-dom';

import styles from './NotFound.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate('/gallery');
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h1">
        <CrisisAlertIcon className={styles.icon} />
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

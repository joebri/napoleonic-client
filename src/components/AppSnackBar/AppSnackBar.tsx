import { Alert, AlertColor, Snackbar } from '@mui/material';
import { SyntheticEvent } from 'react';

import styles from './AppSnackBar.module.scss';

interface AppSnackBarProps {
  message: string;
  onClose: (event: SyntheticEvent<any> | Event) => void;
  open: boolean;
  severity?: AlertColor;
}

const AppSnackBar = ({
  message,
  onClose,
  open,
  severity = 'error',
}: AppSnackBarProps) => {
  const handleClose = (event: SyntheticEvent<any> | Event) => {
    onClose(event);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={6000}
        onClose={(event: SyntheticEvent<any> | Event) => handleClose(event)}
        open={open}
      >
        <Alert
          className={styles.messageAlert}
          onClose={(event: SyntheticEvent<any> | Event) => handleClose(event)}
          severity={severity}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export { AppSnackBar };

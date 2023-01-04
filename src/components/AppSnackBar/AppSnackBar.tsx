/** @jsxImportSource @emotion/react */

import { SyntheticEvent } from 'react';

import { Alert, Snackbar } from '@mui/material';

import { classes } from './AppSnackBar.style';

interface AppSnackBarProps {
  message: string;
  onClose: (event: SyntheticEvent<any> | Event) => void;
  open: boolean;
}

const AppSnackBar = ({ message, onClose, open }: AppSnackBarProps) => {
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
          css={classes.messageAlert}
          onClose={(event: SyntheticEvent<any> | Event) => handleClose(event)}
          severity="error"
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export { AppSnackBar };

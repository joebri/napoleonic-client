import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { SyntheticEvent } from 'react';

import styles from './ConfirmDeleteDialog.module.scss';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: Function;
  onDeleteConfirmed: Function;
}

const ConfirmDeleteDialog = ({
  isOpen,
  onClose,
  onDeleteConfirmed,
}: ConfirmDeleteDialogProps) => {
  const handleClickAwayClose = (
    _: SyntheticEvent<any> | Event,
    reason: string
  ) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  const handleNoClick = () => {
    onClose();
  };

  const handleYesClick = () => {
    onDeleteConfirmed();
  };

  return (
    <Dialog
      className={styles.dialog}
      open={isOpen}
      onClose={handleClickAwayClose}
    >
      <DialogTitle>{'Confirm Delete'}</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleNoClick} variant="outlined">
          No
        </Button>
        <Button onClick={handleYesClick} variant="contained">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { ConfirmDeleteDialog };

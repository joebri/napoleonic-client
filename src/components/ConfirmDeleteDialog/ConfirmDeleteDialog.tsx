/** @jsxImportSource @emotion/react */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { SyntheticEvent } from 'react';

import { classes } from './ConfirmDeleteDialog.style';

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
    <Dialog css={classes.dialog} open={isOpen} onClose={handleClickAwayClose}>
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

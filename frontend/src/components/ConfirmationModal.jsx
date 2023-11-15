import * as React from 'react';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { BootstrapDialog } from '../utils/styles';
import ModalCloseButton from './ModalCloseButton';

const ConfirmationModal = ({ content, confirmFunction, open, setOpen, width = 'sm', fullWidth = true }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
       <BootstrapDialog
        onClose = {handleClose}
        aria-labelledby ='confirmation-dialog-title'
        aria-describedby = 'confirmation-dialog-description'
        open = {open}
        maxWidth = {width}
        fullWidth={fullWidth}
        scroll = 'paper'
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Confirmation
        </DialogTitle>
        <ModalCloseButton handleClose={handleClose}/>
        <DialogContent>
          <DialogContentText id='confirmation-dialog-description'>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
          <Button color='warning' onClick={confirmFunction}>
            Confirm
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default ConfirmationModal;

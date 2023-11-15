import * as React from 'react';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { BootstrapDialog } from '../utils/styles';
import ModalCloseButton from './ModalCloseButton';

const MessageModal = ({ header, content, open, setOpen, width = 'sm', fullWidth = true }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
       <BootstrapDialog
        onClose = {handleClose}
        aria-labelledby ='message-dialog-title'
        aria-describedby = 'message-dialog-description'
        open = {open}
        maxWidth = {width}
        fullWidth={fullWidth}
        scroll = 'paper'
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id='message-dialog-title'>
          {header}
        </DialogTitle>
        <ModalCloseButton handleClose={handleClose}/>
        <DialogContent>
          <DialogContentText id='message-dialog-description'>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default MessageModal;

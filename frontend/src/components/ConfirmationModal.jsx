import * as React from 'react';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { BootstrapDialog } from './MessageModal';

export default function ConfirmationModal ({ content, confirmFunction, open, setOpen, width = 'sm', fullWidth = true }) {
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
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Confirmation
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id='message-dialog-description'>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
          <Button onClick={confirmFunction}>
            Confirm
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

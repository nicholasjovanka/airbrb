import * as React from 'react';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { BootstrapDialog } from '../utils/styles';
import ModalCloseButton from './ModalCloseButton';

/*
Modal used to by the Listing Detail Screen so that a User/Customer can make a booking based on the available dates of that listing
Props explanation:
- open: boolean state variable passed from the parent that dictates when to open the Message modal
- setOpen: The state set function for the 'open' boolean state that allows the modal to close when the close button is clicked
- header: Message displayed as the title of the Message modal
- content: Message displayed in the body of the Message
*/
const MessageModal = ({ header, content, open, setOpen }) => {
  /*
  Function that allows the close button of the modal to close the modal
  */
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
        maxWidth = 'sm'
        fullWidth
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
          <Button autoFocus onClick={handleClose} aria-label='close-modal-button'>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default MessageModal;

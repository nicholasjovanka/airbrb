import * as React from 'react';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { BootstrapDialog } from '../utils/styles';
import ModalCloseButton from './ModalCloseButton';

/*
Common Confirmation Modal Component used as common confirmation popup throughout the application. The action that happens
after the user click the confirmation button is dictated by the confirmFunction prop passed by the parent component

Props Explanation
- content = The message that should be displayed by the confirmation modal
- confirmFunction = function that is passed a prop which will dictate the logic that happens after the confirm button in the modal is clicked
- open: boolean state variable passed from the parent that dictates when to open the booking dialog
- setOpen: The state set function for the 'open' boolean state that allows the modal to close when the close button is clicked
- width: width of the modal
- fullWidth: boolean that dictates if the modal should be displayed in fullwidth
*/
const ConfirmationModal = ({ content, confirmFunction, open, setOpen, width = 'sm', fullWidth = true }) => {
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

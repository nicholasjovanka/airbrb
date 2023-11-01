import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
export default function MessageModal ({ header, content, open, setOpen, width = 'sm', fullWidth = true }) {
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
        width = {width}
        fullWidth={fullWidth}
        scroll = 'paper'
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {header}
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
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

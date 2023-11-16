import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/*
Button Component for Other Modal Based Component that adds a close button on the modal title

Props Explanation;
- handleClose: Function passed as a prop that allows the ModalCloseButton to close the modal its attached too
*/
const ModalCloseButton = ({ handleClose }) => {
  return (
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
  );
}

export default ModalCloseButton;

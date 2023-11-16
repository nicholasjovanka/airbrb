/*
Custom Styling and Custom Styled Material UI Components used by multiple components in the application
*/
import { styled } from '@mui/material/styles';
import { Dialog } from '@mui/material';
export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export const basePaginationStyling = {
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  backgroundColor: 'white',
  border: 1,
  borderColor: 'black',
  width: '100%',
  p: 1
}

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

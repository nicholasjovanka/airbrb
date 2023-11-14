// Shared Javascript based between components for material ui
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

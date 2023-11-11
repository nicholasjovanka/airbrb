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

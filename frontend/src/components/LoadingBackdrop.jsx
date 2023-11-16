import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

/*
Component that is used to show a backdrop that shows a loading bar for all pages.
Inside the application there is only one LoadingBackdrop component which is in the App.jsx.
The state variable used to open this backdrop can be found inside the React Context which can be seen in utils/util.js

Props Explanation;
- open: boolean state variable passed from the parent that dictates when to open the Loading Backdrop
*/
const LoadingBackdrop = ({ open }) => {
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => Math.max.apply(Math, Object.values(theme.zIndex)) + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
export default LoadingBackdrop;

import React from 'react';
import { Link, Typography } from '@mui/material';

/*
Common Copyright Component that shows the copyright text for the login and register page
*/
const Copyright = (props) => {
  return (
    <Typography variant='body2' color='text.secondary' align='center' {...props}>
      {'Copyright © '}
      <Link color='inherit' href='/home'>
        AirBrB
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;

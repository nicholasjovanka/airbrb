import React from 'react';
import { Container, Typography } from '@mui/material';

/*
Not found page component that will appear if the user enters an unregistered url
*/
export default function NotFound () {
  return (
     <Container maxWidth='xl' sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant='h3' sx={{ py: 'auto' }}>
            404 Not Found
        </Typography>
     </Container>
  )
}

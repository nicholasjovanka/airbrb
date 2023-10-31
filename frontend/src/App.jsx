import React from 'react';
import { Route, Routes } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import HostedListing from './pages/hosted-listing';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';

function App () {
  return (
    <React.Fragment>
      <CssBaseline/>
      <Box sx={{ height: '100vh', maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
        <Navbar>
        </Navbar>
        <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Routes>
              <Route path="/hostedlisting/:email" element={<HostedListing/>} />
          </Routes>
        </Box>
      </Box>
    </React.Fragment>
  );
}
export default App;

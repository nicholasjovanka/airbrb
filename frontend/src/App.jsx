import React from 'react';
import { Route, Routes } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import HostedListing from './pages/hosted-listing';
import CreateListing from './pages/hosted-listing/CreateListing';
import NotFound from './pages/not-found';
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
            <Route path="/hostedlisting">
              <Route path=":email" element={<HostedListing/>} />
              <Route path="createlisting" element={<CreateListing/>} />
            </Route>
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </Box>
      </Box>
    </React.Fragment>
  );
}
export default App;

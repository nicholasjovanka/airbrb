import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import HostedListing from './pages/hosted-listing';
import CreateListing from './pages/hosted-listing/CreateListing';
import Home from './pages/home';
import EditListing from './pages/hosted-listing/EditListing';
import NotFound from './pages/not-found';
import Navbar from './components/Navbar';
import { Box, styled } from '@mui/material';
import MessageModal from './components/MessageModal';
import { StoreContext } from './utils/states';
import Login from './pages/login';
import Register from './pages/register';
import Listing from './pages/listing';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

function App () {
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  return (
    <React.Fragment>
      <CssBaseline/>
      <Box sx={{ height: '100vh', maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
        <Navbar/>
        <Offset />
        <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Routes>
              <Route path='home' element={<Home/>} />
              <Route path='login' element={<Login/>} />
              <Route path='register' element={<Register/>} />
              <Route path='/listing'>
                <Route path=':id' element={<Listing/>} />
              </Route>
              <Route path='/hostedlisting'>
                <Route path=':email' element={<HostedListing/>} />
                <Route path='createlisting' element={<CreateListing/>} />
                <Route path='editlisting/:id' element={<EditListing/>} />
              </Route>
              <Route path='/' element={<Navigate to='/home' replace={true} />}/>
              <Route path='*' element={<NotFound/>} />
          </Routes>
          <MessageModal header={modalHeader[0]} content={modalMessage[0]} open={openModal[0]} setOpen={openModal[1]} ></MessageModal>
        </Box>
      </Box>
    </React.Fragment>
  );
}
export default App;

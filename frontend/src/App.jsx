import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import HostedListing from './pages/hosted-listing';
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
import ManageBookings from './pages/hosted-listing/ManageBookings';
import LoadingBackdrop from './components/LoadingBackdrop';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

function App () {
  /*
  Call the objects containing state variables inside the StoreContext and assign them where:
  1. The openModal, modalHeader, and modalMessage object is tied to the MessageModal component so that other components can open and change the content of the message modal using
  the state objects provided by the context
  2. The openBackdrop object is tied to the LoadingBackdrop component so that other components can show a loading bar by changing the state using context

  For more details see the comment in the states.js in the utils folder
  */
  const { openModal, modalHeader, modalMessage, openBackdrop, loggedIn } = useContext(StoreContext);
  return (
    <React.Fragment>
      <CssBaseline/>
      <Box sx={{ height: '100vh', maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
        <Navbar loggedIn={loggedIn[0]} setLoggedIn={loggedIn[1]}/>
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
                <Route path='editlisting/:id' element={<EditListing/>} />
                <Route path='managebookings/:id' element={<ManageBookings/>} />
              </Route>
              <Route path='/' element={<Navigate to='/home' replace={true} />}/>
              <Route path='*' element={<NotFound/>} />
          </Routes>
          <LoadingBackdrop open={openBackdrop[0]}/>
          <MessageModal header={modalHeader[0]} content={modalMessage[0]} open={openModal[0]} setOpen={openModal[1]} ></MessageModal>
        </Box>
      </Box>
    </React.Fragment>
  );
}
export default App;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/states';
import { apiCall, checkEmail } from '../../utils/utils';
import Copyright from '../../components/Copyright';
import { Avatar, Button, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { loggedIn, openModal, modalHeader, modalMessage } = useContext(StoreContext);

  const handleRegister = async () => {
    try {
      if (name.trim().length === 0) {
        throw new Error('Name Cannot Be Empty');
      }
      if (!checkEmail(email)) {
        throw new Error('Invalid Email');
      }
      if (password.trim().length === 0 || confirmPassword.trim().length === 0) {
        throw new Error('Password Cannot Be Empty');
      }
      if (password !== confirmPassword) {
        throw new Error('Password in Password and Confirm Password Field do not match');
      }
      const response = await apiCall('user/auth/register', 'POST', {
        email,
        name,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);
      loggedIn[1](true);
      navigate('/home');
    } catch (error) {
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <OtherHousesIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <Box component='form' noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete='name'
                name='name'
                required
                fullWidth
                id='name'
                label='Name'
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder='Email'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='new-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder='Password'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name='confirmPassword'
                label='Confirm Password'
                type='password'
                id='confirm-password'
                autoComplete='new-password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            onClick={handleRegister}
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
  </Container>
  // <div>
  //   <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
  //   <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
  //   <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
  //   <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm Password' />
  //   <button onClick={handleRegister}>Register</button>
  //   {error && <p className='error'>{error}</p>}
  // </div>
  );
};

export default Register;

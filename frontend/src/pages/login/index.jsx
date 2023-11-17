import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/states';
import { apiCall } from '../../utils/utils';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import Copyright from '../../components/Copyright';

/*
Login Page Component that represents the Login page of the website
Login page made using Sign page template from https://mui.com/material-ui/getting-started/templates/ with some modifications
*/
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { loggedIn, openModal, modalHeader, modalMessage, openBackdrop } = useContext(StoreContext);

  /*
  Function that allows the user to login where upon a succesfull login, the loggedIn state inside the
  StoreContext will be set to true, the user email and token will be stored inside the local storage and then
  the user will be navigated back to the home page
  */
  const handleLogin = async () => {
    try {
      openBackdrop[1](true);
      const response = await apiCall('user/auth/login', 'POST', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token); // Store the authentication token received from the login api
      localStorage.setItem('userEmail', email); // Store the logged in user email

      loggedIn[1](true); // Set the loggedIn state inside the loggedIn object from the StoreContext to signify that the user is logged in
      // Redirect the user to the home page
      navigate('/home');
    } catch (error) {
      openBackdrop[1](false);
      console.error('Login Error:', error.response?.data?.error || 'Unknown error');
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={handleLogin}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};

export default Login;

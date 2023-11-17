import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';

/*
Navbar component that appears at the top of the page
*/
const Navbar = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [pages, setPages] = useState(['Home', 'Hosted Listings']);
  const [settings, setSettings] = useState(['Profile', 'Logout'])
  /*
  useEffect that checks if the user is logged in. If the user is logged in then show the hosted listing link/button/menu in the Navigation Menu in the navbar that allows
  the user to navigate to the hosted listing page, additionaly also show a logout button in the settings menu at the right side of the navbar (The one that
  shows the user initial)
  If the user is not logged in then only show the home button in the Navigation Menu and the Login and Register Button in the settings menu
  */
  useEffect(() => {
    if (!loggedIn) {
      setPages(['Home']);
      setSettings(['Login', 'Register']);
    } else {
      setPages(['Home', 'Hosted Listings'])
      setSettings(['Logout']);
    }
  }, [loggedIn])

  /*
  Function that opens the navigation menu for mobile view
  */
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  /*
  Function that opens the user menu (settings)
  */
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  /*
  Function that closes the navigation menu for mobile view
  */
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  /*
  Function that closes the user menu (settings)
  */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  /*
  Function that navigate the user to a specific page based on the navmenu
  or button in the settings that they click
  */
  const handleNavigation = (pageName) => {
    const userEmail = localStorage.getItem('userEmail');
    let navigationRoute = '';
    switch (pageName) {
      case 'Login': {
        navigationRoute = '/login';
        break;
      }
      case 'Register': {
        navigationRoute = '/register';
        break;
      }
      case 'Home': {
        navigationRoute = '/home';
        break;
      }
      case 'Hosted Listings': {
        navigationRoute = `/hostedlisting/${userEmail}`;
        break;
      }
      case 'Profile': {
        navigationRoute = `/profile/${userEmail}`;
        break;
      }
      case 'Logout': {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setLoggedIn(false);
        navigationRoute = '/home';
        break;
      }
    }
    navigate(navigationRoute);
    setAnchorElNav(null);
    setAnchorElUser(null);
  }
  return (
    <AppBar position='fixed'>
    <Container maxWidth='xl'>
      <Toolbar disableGutters>
        <OtherHousesIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
          variant='h6'
          noWrap
          component='a'
          href='/home'
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          AirBrB
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size='large'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleOpenNavMenu}
            color='inherit'
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={() => { handleNavigation(page) }}>
                <Typography textAlign='center'>{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <OtherHousesIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
        <Typography
          variant='h5'
          noWrap
          component='a'
          href='/home'
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          AirBrB
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => { handleNavigation(page) }}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title='Open settings'>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar> {loggedIn ? localStorage.getItem('userEmail').slice(0, 1) : 'G' }</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px', p: 4 }}
            id='menu-appbar'
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <Typography variant='h6' sx={{ m: 1 }}>Welcome { loggedIn ? localStorage.getItem('userEmail').split('@')[0] : 'Guest' } </Typography>
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={() => { handleNavigation(setting) } }>
                <Typography textAlign='center'>{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  )
}

export default Navbar;

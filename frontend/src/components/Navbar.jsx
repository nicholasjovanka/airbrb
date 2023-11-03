import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../utils/states'
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';

function Navbar () {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [showNavBar, setShowNavBar] = useState(true)
  const [pages, setPages] = useState(['Home', 'Hosted Listings']);
  const [settings, setSettings] = useState(['Profile', 'Logout'])
  const { loggedIn } = useContext(StoreContext);
  const location = useLocation()
  useEffect(() => {
    const currentPage = location.pathname.split('/');
    if (currentPage[1] === 'login' || currentPage[1] === 'register') {
      setShowNavBar(false);
    } else if (currentPage[1] === 'test') {
      setShowNavBar(true);
      loggedIn[1](false);
    } else {
      setShowNavBar(true);
      loggedIn[1](true);
    }
  }, [location])

  useEffect(() => {
    if (!loggedIn[0]) {
      setPages(['Home']);
      setSettings(['Login', 'Register']);
    } else {
      setPages(['Home', 'Hosted Listings'])
      setSettings(['Profile', 'Logout']);
    }
  }, [loggedIn[0]])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
    }
    return () => {
      navigate(navigationRoute);
      setAnchorElNav(null);
      setAnchorElUser(null);
    }
  }

  if (showNavBar) {
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
                <MenuItem key={page} onClick={handleNavigation(page)}>
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
                onClick={handleNavigation(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleNavigation(setting)}>
                  <Typography textAlign='center'>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    )
  } else {
    return null
  }
}
export default Navbar;

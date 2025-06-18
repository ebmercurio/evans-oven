import { useState } from 'react';
import {
  AppBar, Button, Container, Toolbar, Typography,
  Grid,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import './index.css';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TopNavLogo from './TopNavLogo';
import { straightFont, whiteBackground } from '../../Constants';
import AccountMenu from './AccountMenu';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../providers/ModalProvider';
import SearchEmblem from '../../components/SearchEmblem';
import SearchBar from '../../components/SearchBar';

export default function TopNav() {
  const { currentUser } = useAuth();
  const { setShowLoginModal } = useModal();
  const url = useLocation().pathname;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: whiteBackground,
        zIndex: 9998,
        justifyContent: 'center',
        height: '90px',
      }}
    >
      <Container
        maxWidth="lg"
      >
        <Toolbar disableGutters sx={{ zIndex: 9998, padding: 0 }}>
          <Grid // TopNav Mobile screen
            container
            sx={{
              display: {
                xs: 'flex',
                md: 'none',
              },
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 0,
            }}
          >
            <Grid item xs="auto">
              <Button
                id="logoButton"
                data-testid="logoButton"
                component={Link}
                to="/home"
              >
                <TopNavLogo size="small" />
              </Button>
            </Grid>

            <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
              <SearchBar />
            </Grid>

            <Grid item xs="auto">
              <IconButton
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                  zIndex: 9999,
                  '& .MuiPaper-root': {
                    backgroundColor: whiteBackground,
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <MenuItem component={Link} to="/home" onClick={handleClose}>
                  <HomeIcon />
                  <Typography fontFamily={straightFont} color="black">
                    Home
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/recipes" onClick={handleClose}>
                  <RestaurantMenuIcon />
                  <Typography fontFamily={straightFont} color="black">
                    Recipes
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem>
                  {currentUser != null ? (
                    <>
                      <AccountMenu />
                      <Typography fontFamily={straightFont} color="black">
                        Profile
                      </Typography>
                    </>
                  ) : (
                    <Button onClick={handleLoginClick}>
                      <Typography
                        sx={{
                          fontFamily: straightFont,
                          fontSize: { xs: '20px', sm: '25px' },
                          color: 'success.main',
                        }}
                      >
                        Login
                      </Typography>
                    </Button>
                  )}
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
          <Grid // TopNav Normal screen
            container
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              }, // make this none for small screens
              justifyContent: 'space-between',
              padding: 0,
            }}
          >
            <Grid
              item
              xs={1}
              sm={4}
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex',
                },
                justifyContent: 'left',
                alignItems: 'center',
                padding: 0,
              }}
            >
              <Button
                id="logoButton"
                data-testid="logoButton"
                component={Link}
                to="/home"
              >

                <TopNavLogo size="large" />
              </Button>
            </Grid>
            <Grid
              item
              xs={1}
              sm={4}
              sx={{
                display: {
                  xs: 'flex',
                  md: 'none',
                },
                justifyContent: 'left',
                alignItems: 'center',
                padding: 0,
              }}
            >
              <Button
                id="logoButton"
                data-testid="logoButton"
                component={Link}
                to="/home"
              >

                <TopNavLogo size="small" />
              </Button>
            </Grid>

            <Grid
              item
              xs={11}
              sm={8}
              sx={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'center',
                padding: 0,
              }}
            >

              {url !== '/home' && (
                <Button component={Link} to="/home">
                  <Typography
                    fontFamily={straightFont}
                    sx={{
                      fontSize: { xs: '20px', sm: '25px' },
                    }}
                    color="black"
                  >
                    Home
                  </Typography>
                </Button>
              )}
              {url !== '/recipes' && (
                <Button id="recipesButton" component={Link} to="/recipes">
                  <Typography
                    fontFamily={straightFont}
                    sx={{
                      fontSize: { xs: '20px', sm: '25px' },
                    }}
                    color="black"
                  >
                    Recipes
                  </Typography>
                </Button>
              )}

              <SearchEmblem />
              {currentUser != null ? (
                <AccountMenu />
              ) : (
                <Button onClick={handleLoginClick}>
                  <Typography
                    sx={{
                      fontFamily: straightFont,
                      fontSize: { xs: '20px', sm: '25px' },
                      color: 'success.main',
                    }}
                  >
                    Login
                  </Typography>
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

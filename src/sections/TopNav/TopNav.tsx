import {
  AppBar, Button, Container, Toolbar, Typography,
  Grid,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import './index.css';
import TopNavLogo from './TopNavLogo';
import SearchBar from '../../components/SearchEmblem/SearchEmblem';
import { straightFont, whiteBackground } from '../../Constants';
import AccountMenu from './AccountMenu';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../providers/ModalProvider';

export default function TopNav() {
  const { currentUser } = useAuth();
  const { setShowLoginModal } = useModal();
  const url = useLocation().pathname;

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: whiteBackground,
        color: (theme) => theme.palette.primary.main,
        zIndex: 9999,
        height: 100,
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ zIndex: 9998, padding: 0 }}>
          <Grid
            container
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
            }}
          >
            <Grid
              item
              xs={4}
              sx={{
                display: 'flex',
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
                <TopNavLogo />
              </Button>
            </Grid>

            <Grid
              item
              xs={8}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'left', sm: 'right' },
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

              <SearchBar />
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

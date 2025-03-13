import {
  AppBar, Button, Container, Toolbar, Box, Typography, styled,
} from '@mui/material';
import { Link } from 'react-router-dom';
import './index.css';
import TopNavLogo from './TopNavLogo';
import SearchBar from '../../components/SearchEmblem/SearchEmblem';
import { straightFont, whiteBackground } from '../../Constants';
import AccountMenu from './AccountMenu';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../providers/ModalProvider';

const StyledTypography = styled(Typography)({
  fontFamily: straightFont,
  fontSize: '25px',
  color: 'black',
});

export default function TopNav() {
  const { currentUser } = useAuth();
  const { setShowLoginModal } = useModal();

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
        <Toolbar sx={{ zIndex: 9998 }}>
          <Box
            sx={{
              padding: 0,
              flexGrow: 1,
            }}
          >
            <Button
              id="logoButton"
              data-testid="logoButton"
              component={Link}
              to="/"
            >
              <TopNavLogo />
            </Button>
          </Box>
          <Box>
            <Button component={Link} to="/">
              <StyledTypography>
                Home
              </StyledTypography>
            </Button>
            <Button id="recipesButton" component={Link} to="/recipes">
              <StyledTypography>
                Recipes
              </StyledTypography>
            </Button>
            <SearchBar />
          </Box>
          {currentUser != null ? (
            <AccountMenu />
          ) : (
            <Button onClick={handleLoginClick}>
              <Typography sx={{
                fontFamily: straightFont,
                fontSize: '25px',
                color: 'success.main',
              }}
              >
                Login
              </Typography>
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

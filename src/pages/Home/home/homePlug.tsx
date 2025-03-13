import {
  Grid, Typography, Button, Box,
} from '@mui/material';
import insta from '../../../common/images/logos/insta.png';
import pin from '../../../common/images/logos/pin.png';
import {
  cursiveFont, darkGold, straightFont,
  white,
} from '../../../Constants';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal } from '../../../providers/ModalProvider';

export default function HomePlug() {
  const { currentUser } = useAuth();
  const { setShowSignup } = useModal();

  return (
    <Box sx={{ backgroundColor: '#5A6E50', height: '10%' }}>
      <Grid container>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontFamily: straightFont,
              fontWeight: 'bold',
              py: 7,
              paddingLeft: 5,
            }}
          >
            Follow Us
          </Typography>
          <Button sx={{
            '&:hover': {
              opacity: 0.7,
            },
          }}
          >
            <img
              src={insta}
              alt="instagramLogo"
              style={{
                width: 50,
                height: 50,
                borderRadius: 100 / 2,
              }}
            />
          </Button>
          <Button sx={{
            '&:hover': {
              opacity: 0.7,
            },
          }}
          >
            <img
              src={pin}
              alt="pintrestLogo"
              style={{
                width: 40,
                height: 40,
                borderRadius: 100 / 2,
              }}
            />
          </Button>
        </Grid>
        {!currentUser && (
          <Grid container item xs={12} sm={6} justifyContent="center" alignItems="center">
            <Button
              onClick={() => setShowSignup(true)}
              sx={{
                backgroundColor: '#D9A253', // Default button color (warm gold)
                color: white, // White text
                fontWeight: 'bold',
                borderRadius: '8px',
                padding: '12px 24px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: darkGold, // Darker gold on hover
                  transform: 'scale(1.03)', // Slight pop effect
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)', // Soft shadow
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: cursiveFont,
                  paddingRight: 1,
                }}
              >
                Signup
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: straightFont,
                  paddingLeft: 1,
                }}
              >
                for email updates
              </Typography>
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

/* eslint-disable max-len */
import {
  Box,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import TopNavLogo from '../TopNav/TopNavLogo';

export default function SimpleBottomNavigation() {
  return (
    <Box sx={{ backgroundColor: '#5A6E50', py: 2 }}>
      <Container>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item>
            <TopNavLogo size="large" />
          </Grid>
          <Grid item>
            <Typography sx={{ m: 2, color: 'white', fontSize: '0.9rem' }}>
              &copy;
              {' '}
              {new Date().getFullYear()}
              {' '}
              Evan&apos;s Oven
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Typography sx={{
            fontSize: '0.8rem', color: 'white', textAlign: 'center', px: 2,
          }}
          >
            ⚠️ **Cooking & Food Safety Disclaimer:** Recipes are for informational purposes only. Always follow proper food safety guidelines and manufacturer instructions when using kitchen appliances. Never leave an air fryer unattended. Use high smoke point oils to prevent burning or fire hazards. By using this site, you acknowledge the site owner is not responsible for any injuries, foodborne illnesses, or appliance-related issues.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

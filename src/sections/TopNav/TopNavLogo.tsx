import { Typography } from '@mui/material';
import { primary } from '../../Constants';

function TopNavLogo() {
  return (
    <Typography sx={{
      fontFamily: 'Caveat',
      fontSize: '45px',
      fontWeight: 500,
      color: primary,
      textTransform: 'lowercase',
    }}
    >
      Evan&apos;s Oven
    </Typography>
  );
}

export default TopNavLogo;

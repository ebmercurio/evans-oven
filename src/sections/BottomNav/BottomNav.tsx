import { Grid, Hidden } from '@mui/material';
import SearchBar from '../../components/SearchBar';

export default function BottomNav() {
  return (
    <Hidden mdUp>
      <Grid container position="fixed">
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
          }}
        >
          <SearchBar />
        </Grid>
      </Grid>
    </Hidden>
  );
}

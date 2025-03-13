import { Grid, Typography } from '@mui/material';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';

export default function RecipeHeader() {
  const { currentRecipe } = useRecipeContext();

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1,
        }}
      >
        {/* Recipe Title */}
        <Typography
          variant="h5"
          sx={{
            pb: 1,
            fontFamily: 'Montserrat',
            fontWeight: 600,
          }}
        >
          {currentRecipe.title}
        </Typography>
      </Grid>
    </Grid>
  );
}

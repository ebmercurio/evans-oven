import {
  Grid,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';
import IngredientsList from './recipeIngredients';
import { straightFont, warmGold } from '../../../Constants';

export default function RecipeInfo() {
  const { currentRecipe } = useRecipeContext();
  return (
    <Grid>

      {/* Recipe Title */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'Montserrat',
          fontWeight: 600,
        }}
      >
        {currentRecipe.title}
      </Typography>

      {/* Rating */}
      <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
        <Rating
          size="small"
          value={currentRecipe.averageRating}
          precision={0.1}
          readOnly
          sx={{
            mr: 1,
            '& .MuiRating-iconEmpty': {
              color: warmGold, // Change the border color of empty stars
            },
          }}
        />
        <Typography>{`(${currentRecipe.commentsWithRatings ?? 0} ratings)`}</Typography>
      </Stack>

      {/* Servings */}
      <Typography sx={{ fontFamily: straightFont }}>
        Servings:
        {' '}
        {currentRecipe.servings}
      </Typography>

      {/* Ingredients List */}
      <IngredientsList />
    </Grid>
  );
}

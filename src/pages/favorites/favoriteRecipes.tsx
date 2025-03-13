/* eslint-disable no-self-compare */
import { useQuery } from '@tanstack/react-query';
import {
  Grid, Typography, Divider,
} from '@mui/material';
import { useEffect } from 'react';
import IRecipe from '../../interfaces/IRecipe';
import { getFavoriteRecipes } from '../../services/DbService';
import RecipeCard from '../../components/RecipeCards/recipeCard';
import { useAuth } from '../../contexts/AuthContext';
import { blackText, straightFont } from '../../Constants';

export default function FavoriteRecipes() {
  const { currentUser } = useAuth();

  const { data: favoriteRecipesData, isLoading, error: allRecipesError } = useQuery(
    ['allFavoritesRecipes'],
    async () => {
      const res = await getFavoriteRecipes(currentUser?.uid ?? '');
      return res;
    },
  );

  useEffect(() => {

  }, [currentUser]);

  if (allRecipesError) {
    return <div>Error loading favorite recipes</div>;
  }

  return (
    <Grid container sx={{ padding: '0 16px' }}>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ fontFamily: straightFont, color: blackText, fontSize: '35px' }}>
          Favorite Recipes
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>

      {isLoading && (
        <Typography>Loading...</Typography>
      )}

      <Grid container spacing={1}>
        {favoriteRecipesData?.length ?? 0 > 0 ? (
          favoriteRecipesData?.map((recipe: IRecipe) => (
            <Grid item xs={12} sm={3}>
              <RecipeCard key={recipe.id} recipe={recipe} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No favorite recipes found.</Typography>
          </Grid>
        )}
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
    </Grid>
  );
}

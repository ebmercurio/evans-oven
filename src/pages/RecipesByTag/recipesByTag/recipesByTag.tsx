import {
  Grid, Typography, Divider, Button, Box,
  Card,
  Rating,
} from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import RecipeCard from '../../../components/RecipeCards/recipeCard';
import { getRecipesByTag } from '../../../services/DbService';
import IRecipe from '../../../interfaces/IRecipe';
import {
  straightFont, primary, blackText, warmGold,
  whiteBackground,
  darkGold,
} from '../../../Constants';

export default function RecipesByTag() {
  const { tagName } = useParams();
  // const [tag, setTag] = useState<string>();

  const [latestIndex, setLatestIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [allIndex, setAllIndex] = useState(0);
  const batchSize = 6;

  const { data: recipesByTag } = useQuery(['recipesByTag'], async () => {
    const res = await getRecipesByTag(tagName ?? '');
    return res;
  });

  const latestRecipes = [...recipesByTag ?? []].sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
  );
  const popularRecipes = [...recipesByTag ?? []].sort((a, b) => b.favorites - a.favorites);

  const handleLoadMore = (section: string) => {
    if (section === 'latest') setLatestIndex((prev) => prev + batchSize);
    if (section === 'popular') setPopularIndex((prev) => prev + batchSize);
    if (section === 'all') setAllIndex((prev) => prev + batchSize);
  };

  // useEffect(() => {
  //   setTag(tagName);
  // }, [tagName]);

  const featuredRecipe = recipesByTag?.[0];

  const renderRecipeSection = (recipes: IRecipe[], index: number, section: string) => (
    <Grid container spacing={2}>
      {recipes.slice(0, index + batchSize).map((recipe) => (
        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </Grid>
      ))}
      {index + batchSize < recipes.length && (
        <Box sx={{ textAlign: 'center', width: '100%', marginTop: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleLoadMore(section)}
            sx={{
              backgroundColor: warmGold,
              '&:hover': {
                backgroundColor: darkGold, // Darker gold on hover
                transform: 'scale(1.03)', // Slight pop effect
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)', // Soft shadow
              },
            }}
          >
            Load More
            {' '}
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Button>
        </Box>
      )}
    </Grid>
  );

  return (
    <Grid container sx={{ padding: '16px', backgroundColor: whiteBackground }}>
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
        {tagName && (
          <Typography sx={{ fontFamily: straightFont, color: primary, fontSize: '35px' }}>
            {tagName.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            {' '}
            Recipes
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>

      {/* Centered Featured Section */}
      <Grid container justifyContent="center" sx={{ marginBottom: '24px' }}>
        <Grid item xs={12} md={10} lg={8}>
          {featuredRecipe && (
            <Card sx={{ display: 'flex', padding: '16px', backgroundColor: primary }}>
              <RecipeCard recipe={featuredRecipe} />
              <Box sx={{ flex: 1, paddingLeft: '16px' }}>
                <Typography variant="h5" fontFamily={straightFont} sx={{ color: blackText, marginBottom: '16px' }}>
                  {featuredRecipe?.title}
                </Typography>
                <Typography variant="body1" fontFamily={straightFont} sx={{ marginBottom: '16px' }}>
                  <strong>Servings:</strong>
                  {' '}
                  {featuredRecipe.servings}
                </Typography>
                <Typography variant="body1" fontFamily={straightFont} sx={{ marginBottom: '16px' }}>
                  <strong>Rating:</strong>
                  {' '}
                  <Rating name="read-only" value={featuredRecipe.averageRating ?? 0} readOnly />
                </Typography>
                <Typography variant="body2" fontFamily={straightFont} sx={{ marginBottom: '16px', color: warmGold }}>
                  <strong>Featured Item</strong>
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: warmGold,
                    '&:hover': {
                      backgroundColor: '#C28A45', // Darker gold on hover
                      transform: 'scale(1.03)', // Slight pop effect
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)', // Soft shadow
                    },
                  }}
                >
                  Try This Recipe
                </Button>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 2, width: '100%', backgroundColor: primary }} />

      {/* Latest Recipes */}
      <Grid item xs={12}>
        <Typography
          variant="h5"
          fontFamily={straightFont}
          sx={{
            color: primary,
            fontWeight: '600',
            my: 2, // Add space below search bar
          }}
        >
          Latest Recipes
        </Typography>
        {renderRecipeSection(latestRecipes, latestIndex, 'latest')}
      </Grid>

      <Divider sx={{ my: 2, width: '100%', backgroundColor: primary }} />

      {/* Popular Recipes */}
      <Grid item xs={12}>
        <Typography
          variant="h5"
          fontFamily={straightFont}
          sx={{
            color: primary,
            fontWeight: '600',
            my: 2, // Add space below search bar
          }}
        >
          Popular Recipes
        </Typography>
        {renderRecipeSection(popularRecipes, popularIndex, 'popular')}
      </Grid>

      <Divider sx={{ my: 2, width: '100%', backgroundColor: primary }} />

      {/* All Recipes */}
      <Grid item xs={12}>
        <Typography
          variant="h5"
          fontFamily={straightFont}
          sx={{
            color: primary,
            fontWeight: '600',
            my: 2, // Add space below search bar
          }}
        >
          All Recipes
        </Typography>
        {renderRecipeSection(recipesByTag ?? [], allIndex, 'all')}
      </Grid>
    </Grid>
  );
}
